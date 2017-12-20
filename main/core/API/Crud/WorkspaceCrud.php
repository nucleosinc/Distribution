<?php

namespace Claroline\CoreBundle\API\Crud;

use Claroline\CoreBundle\API\Crud;
use Claroline\CoreBundle\API\Options;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Event\CrudEvent;
use Claroline\CoreBundle\Manager\WorkspaceManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.crud.workspace")
 * @DI\Tag("claroline.crud")
 */
class WorkspaceCrud
{
    /**
     * WorkspaceCrud constructor.
     *
     * @DI\InjectParams({
     *     "manager" = @DI\Inject("claroline.manager.workspace_manager")
     * })
     *
     * @param WorkspaceManager $manager
     */
    public function __construct(WorkspaceManager $manager)
    {
        $this->manager = $manager;
    }

    /**
     * @DI\Observe("crud_pre_delete_object_claroline_corebundle_entity_workspace_workspace")
     *
     * @param CrudEvent $event
     */
    public function preDelete(CrudEvent $event)
    {
        $this->manager->deleteWorkspace($event->getObject());
    }

    /**
     * @DI\Observe("crud_pre_copy_object_claroline_corebundle_entity_workspace_workspace")
     *
     * @param CrudEvent $event
     */
    public function preCopy(CrudEvent $event)
    {
        $workspace = $event->getObject();
        $options = $event->getOptions();

        $new = $options[Crud::NEW_OBJECT];
        $new->setName($workspace->getName());
        $new->setCode($workspace->getCode());

        $this->manager->copy($workspace, $new, in_array(Options::WORKSPACE_MODEL, $options));
    }
}
