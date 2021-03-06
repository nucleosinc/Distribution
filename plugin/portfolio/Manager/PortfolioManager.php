<?php

namespace Icap\PortfolioBundle\Manager;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Event\Log\LogGenericEvent;
use Claroline\TeamBundle\Manager\TeamManager;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManager;
use Icap\PortfolioBundle\Entity\Portfolio;
use Icap\PortfolioBundle\Entity\PortfolioGuide;
use Icap\PortfolioBundle\Entity\PortfolioUser;
use Icap\PortfolioBundle\Event\Log\PortfolioAddGuideEvent;
use Icap\PortfolioBundle\Event\Log\PortfolioAddViewerEvent;
use Icap\PortfolioBundle\Event\Log\PortfolioRemoveGuideEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Form\FormFactory;

/**
 * @DI\Service("icap_portfolio.manager.portfolio")
 */
class PortfolioManager
{
    const PORTFOLIO_OPENING_MODE_VIEW = 'view';
    const PORTFOLIO_OPENING_MODE_EVALUATE = 'evaluate';
    const PORTFOLIO_OPENING_MODE_EDIT = 'edit';

    /**
     * @var \Doctrine\ORM\EntityManager
     */
    protected $entityManager;

    /**
     * @var \Symfony\Component\Form\FormFactory
     */
    protected $formFactory;

    /**
     * @var \Icap\PortfolioBundle\Manager\WidgetsManager
     */
    protected $widgetsManager;

    /**
     * @var EventDispatcherInterface
     */
    protected $eventDispatcher;

    /**
     * @var TeamManager
     */
    protected $teamManager;

    /**
     * @DI\InjectParams({
     *     "entityManager"   = @DI\Inject("doctrine.orm.entity_manager"),
     *     "formFactory"     = @DI\Inject("form.factory"),
     *     "widgetsManager"  = @DI\Inject("icap_portfolio.manager.widgets"),
     *     "eventDispatcher" = @DI\Inject("event_dispatcher"),
     *     "teamManager"     = @DI\Inject("claroline.manager.team_manager")
     * })
     */
    public function __construct(EntityManager $entityManager, FormFactory $formFactory, WidgetsManager $widgetsManager,
        EventDispatcherInterface $eventDispatcher, TeamManager $teamManager)
    {
        $this->entityManager = $entityManager;
        $this->formFactory = $formFactory;
        $this->widgetsManager = $widgetsManager;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * @param Portfolio $portfolio
     *
     * @throws \InvalidArgumentException
     */
    public function addPortfolio(Portfolio $portfolio)
    {
        $this->persistPortfolio($portfolio);
    }

    /**
     * @param Portfolio $portfolio
     * @param bool      $refreshUrl
     */
    public function renamePortfolio(Portfolio $portfolio, $refreshUrl = false)
    {
        if ($refreshUrl) {
            $portfolio->setSlug(null);
        }

        $this->entityManager->persist($portfolio);
        $this->entityManager->flush();
    }

    /**
     * @param Portfolio                               $portfolio
     * @param Collection|PortfolioUser[]              $originalPortfolioUsers
     * @param \Doctrine\Common\Collections\Collection $originalPortfolioGroups
     * @param \Doctrine\Common\Collections\Collection $originalPortfolioTeams
     */
    public function updateVisibility(Portfolio $portfolio, Collection $originalPortfolioUsers,
        Collection $originalPortfolioGroups, Collection $originalPortfolioTeams)
    {
        $portfolioUsers = $portfolio->getPortfolioUsers();
        $addedPortfolioViewersToNotify = [];

        foreach ($portfolioUsers as $portfolioUser) {
            if ($originalPortfolioUsers->contains($portfolioUser)) {
                $originalPortfolioUsers->removeElement($portfolioUser);
            } else {
                $addedPortfolioViewersToNotify[] = $portfolioUser;
            }
        }

        foreach ($originalPortfolioUsers as $originalPortfolioUser) {
            $this->entityManager->remove($originalPortfolioUser);
        }

        $portfolioGroups = $portfolio->getPortfolioGroups();

        foreach ($portfolioGroups as $portfolioGroup) {
            if ($originalPortfolioGroups->contains($portfolioGroup)) {
                $originalPortfolioGroups->removeElement($portfolioGroup);
            }
        }

        foreach ($originalPortfolioGroups as $originalPortfolioGroup) {
            $this->entityManager->remove($originalPortfolioGroup);
        }

        $portfolioTeams = $portfolio->getPortfolioTeams();

        foreach ($portfolioTeams as $portfolioTeam) {
            if ($originalPortfolioTeams->contains($portfolioTeam)) {
                $originalPortfolioTeams->removeElement($portfolioTeam);
            }
        }

        foreach ($originalPortfolioTeams as $originalPortfolioTeam) {
            $this->entityManager->remove($originalPortfolioTeam);
        }

        $this->persistPortfolio($portfolio);

        foreach ($addedPortfolioViewersToNotify as $addedPortfolioViewer) {
            $portfolioAddViewerEvent = new PortfolioAddViewerEvent($portfolio, $addedPortfolioViewer);
            $this->dispatch($portfolioAddViewerEvent);
        }
    }

    /**
     * @param Portfolio                   $portfolio
     * @param Collection|PortfolioGuide[] $originalPortfolioGuides
     */
    public function updateGuides(Portfolio $portfolio, Collection $originalPortfolioGuides)
    {
        $portfolioGuides = $portfolio->getPortfolioGuides();
        /** @var PortfolioGuide[] $addedPortfolioGuidesToNotify */
        $addedPortfolioGuidesToNotify = [];
        /** @var PortfolioGuide[] $removedPortfolioGuidesToNotify */
        $removedPortfolioGuidesToNotify = [];

        foreach ($portfolioGuides as $portfolioGuide) {
            if ($originalPortfolioGuides->contains($portfolioGuide)) {
                $originalPortfolioGuides->removeElement($portfolioGuide);
            } else {
                $addedPortfolioGuidesToNotify[] = $portfolioGuide;
            }
        }

        foreach ($originalPortfolioGuides as $originalPortfolioGuide) {
            $this->entityManager->remove($originalPortfolioGuide);
            $removedPortfolioGuidesToNotify[] = $originalPortfolioGuide;
        }

        $this->persistPortfolio($portfolio);

        foreach ($addedPortfolioGuidesToNotify as $addedPortfolioGuide) {
            $portfolioAddGuideEvent = new PortfolioAddGuideEvent($portfolio, $addedPortfolioGuide);
            $this->dispatch($portfolioAddGuideEvent);
        }
        foreach ($removedPortfolioGuidesToNotify as $removedPortfolioGuide) {
            $portfolioAddGuideEvent = new PortfolioRemoveGuideEvent($portfolio, $removedPortfolioGuide);
            $this->dispatch($portfolioAddGuideEvent);
        }
    }

    /**
     * @param LogGenericEvent $event
     */
    protected function dispatch(LogGenericEvent $event)
    {
        $this->eventDispatcher->dispatch('log', $event);
    }

    /**
     * @param Portfolio $portfolio
     */
    public function deletePortfolio(Portfolio $portfolio)
    {
        $this->entityManager->remove($portfolio);
        $this->entityManager->flush();
    }

    /**
     * @param Portfolio $portfolio
     */
    private function persistPortfolio(Portfolio $portfolio)
    {
        $this->entityManager->persist($portfolio);
        $this->entityManager->flush();
    }

    /**
     * @param Portfolio $portfolio
     *
     * @return array
     */
    public function getPortfolioData(Portfolio $portfolio)
    {
        /** @var \Icap\PortfolioBundle\Entity\PortfolioWidget[] $portfolioWidgets */
        $portfolioWidgets = $this->widgetsManager->getByPortfolioForGridster($portfolio);
        /** @var \Icap\PortfolioBundle\Entity\PortfolioComment[] $comments */
        $comments = $this->entityManager->getRepository('IcapPortfolioBundle:PortfolioComment')->findSome($portfolio);

        $data = [
            'id' => $portfolio->getId(),
            'title' => $portfolio->getTitle(),
            'portfolioWidgets' => [],
        ];

        foreach ($portfolioWidgets as $portfolioWidget) {
            $data['portfolioWidgets'][] = $this->widgetsManager->getPortfolioWidgetData($portfolioWidget);
        }

        $commentsDatas = [];

        foreach ($comments as $comment) {
            $commentsDatas[] = $comment->getData();
        }
        $data['comments'] = $commentsDatas;
        $data['unreadComments'] = $portfolio->getCountUnreadComments();
        $data['commentsViewAt'] = $portfolio->getCommentsViewAt()->format(DATE_W3C);

        return $data;
    }

    /**
     * @param User $user
     *
     * @return array
     */
    public function getUserGuidedPortfoliosData(User $user)
    {
        /** @var \Icap\PortfolioBundle\Entity\Portfolio[] $portfolios */
        $portfolios = $this->entityManager->getRepository('IcapPortfolioBundle:Portfolio')->findAvailableToGuideByUser($user);

        $data = [];

        foreach ($portfolios as $portfolio) {
            $data[] = $this->getUserGuidedPortfolioData($portfolio, $user);
        }

        return $data;
    }

    /**
     * @param Portfolio $portfolio
     * @param User      $user
     *
     * @return array
     */
    public function getUserGuidedPortfolioData(Portfolio $portfolio, User $user)
    {
        return [
            'type' => ($user === $portfolio->getUser()) ? 'owned' : 'guided',
            'id' => $portfolio->getId(),
            'title' => $portfolio->getTitle(),
            'unreadComments' => $portfolio->getCountUnreadComments(),
            'commentsViewAt' => $portfolio->getCommentsViewAt()->format(DATE_W3C),
        ];
    }

    /**
     * @param object $data
     *
     * @return \Symfony\Component\Form\Form|\Symfony\Component\Form\FormInterface
     */
    public function getForm($data)
    {
        return $this->formFactory->create('icap_portfolio_portfolio_form', $data);
    }

    /**
     * @param Portfolio $portfolio
     * @param array     $parameters
     *
     * @throws \InvalidArgumentException
     *
     * @return array
     */
    public function handle(Portfolio $portfolio, array $parameters, $env = 'prod')
    {
        $data = [];

        $form = $this->getForm($portfolio);
        $form->submit($parameters);

        if ($form->isValid()) {
            $this->entityManager->persist($portfolio);
            $this->entityManager->flush();

            $data = $this->getPortfolioData($portfolio);

            return $data;
        }

        throw new \InvalidArgumentException();
    }

    /**
     * @param Portfolio $portfolio
     * @param User|null $user
     * @param bool      $isAdmin
     *
     * @return string|null
     */
    public function getOpeningMode(Portfolio $portfolio, $user, $isAdmin = false)
    {
        $openingMode = null;

        if (null !== $user) {
            if ($user === $portfolio->getUser() || $isAdmin) {
                $openingMode = self::PORTFOLIO_OPENING_MODE_EDIT;
            } elseif ($portfolio->hasGuide($user)) {
                $openingMode = self::PORTFOLIO_OPENING_MODE_EVALUATE;
            } elseif ($this->visibleToUser($portfolio, $user)) {
                $openingMode = self::PORTFOLIO_OPENING_MODE_VIEW;
            }
        } elseif (Portfolio::VISIBILITY_EVERYBODY === $portfolio->getVisibility()) {
            $openingMode = self::PORTFOLIO_OPENING_MODE_VIEW;
        }

        return $openingMode;
    }

    /**
     * @param Portfolio $portfolio
     * @param User      $user
     *
     * @return bool
     */
    public function visibleToUser(Portfolio $portfolio, User $user)
    {
        $visibility = $portfolio->getVisibility();
        $isVisible = false;

        if ($portfolio->getUser() === $user) {
            $isVisible = true;
        } else {
            if (Portfolio::VISIBILITY_EVERYBODY === $visibility ||
                Portfolio::VISIBILITY_PLATFORM_USER === $visibility) {
                $isVisible = true;
            } elseif (Portfolio::VISIBILITY_USER === $visibility) {
                $portfolioUsers = $portfolio->getPortfolioUsers();

                foreach ($portfolioUsers as $portfolioUser) {
                    if ($user === $portfolioUser->getUser()) {
                        $isVisible = true;
                        break;
                    }
                }

                if (!$isVisible) {
                    $portfolioGroups = $portfolio->getPortfolioGroups();
                    $userGroups = $user->getGroups();

                    foreach ($portfolioGroups as $portfolioGroup) {
                        foreach ($userGroups as $userGroup) {
                            if ($userGroup === $portfolioGroup->getGroup()) {
                                $isVisible = true;
                                break;
                            }
                        }
                    }
                }

                if (!$isVisible) {
                    $portfolioTeams = $portfolio->getPortfolioTeams();
                    /** @var \Claroline\TeamBundle\Entity\Team[] $userTeams */
                    $userTeams = $this->teamManager->getTeamsByUser($user);

                    foreach ($portfolioTeams as $portfolioTeam) {
                        foreach ($userTeams as $userTeam) {
                            if ($userTeam === $portfolioTeam->getTeam()) {
                                $isVisible = true;
                                break;
                            }
                        }
                    }
                }
            }
        }

        return $isVisible;
    }

    /**
     * @param Portfolio $portfolio
     */
    public function updateCommentsViewDate(Portfolio $portfolio)
    {
        $portfolio->setCommentsViewAt(new \DateTime());

        $this->entityManager->flush($portfolio);
    }

    /**
     * @return int
     */
    public function countAll()
    {
        /** @var \Icap\PortfolioBundle\Repository\PortfolioRepository $portfolioRepository */
        $portfolioRepository = $this->entityManager->getRepository('IcapPortfolioBundle:Portfolio');

        return $portfolioRepository->countAll();
    }

    /**
     * @return int
     */
    public function countAllDeleted()
    {
        /** @var \Icap\PortfolioBundle\Repository\PortfolioRepository $portfolioRepository */
        $portfolioRepository = $this->entityManager->getRepository('IcapPortfolioBundle:Portfolio');

        return $portfolioRepository->countAllDeleted();
    }

    /**
     * @return int
     */
    public function countAllByVisibilityStatus()
    {
        /** @var \Icap\PortfolioBundle\Repository\PortfolioRepository $portfolioRepository */
        $portfolioRepository = $this->entityManager->getRepository('IcapPortfolioBundle:Portfolio');

        return $portfolioRepository->countAllByVisibilityStatus();
    }
}
