<?php

namespace Claroline\MusicTheoryBundle\Listener;

use Claroline\CoreBundle\Event\PluginOptionsEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\KernelInterface;

/**
 * Listens to the core plugin events.
 *
 * @DI\Service("claro_music_theory.listener.plugin")
 */
class PluginListener
{
    /**
     * @var ContainerInterface
     */
    private $container;

    /**
     * TunerListener constructor.
     *
     * @DI\InjectParams({
     *     "container" = @DI\Inject("service_container")
     * })
     *
     * @param ContainerInterface $container
     */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * @DI\Observe("plugin_options_musictheorybundle")
     *
     * @param PluginOptionsEvent $event
     */
    public function onConfigure(PluginOptionsEvent $event)
    {
        // todo : configure default note naming
        // todo : configure sharp/flat preference
        $params = [];
        $params['_controller'] = 'InnovaVideoRecorderBundle:VideoRecorder:pluginConfigureForm';
        $subRequest = $this->container->get('request')->duplicate([], null, $params);
        $response = $this->container->get('http_kernel')->handle($subRequest, KernelInterface::SUB_REQUEST);
        $event->setResponse($response);
        $event->stopPropagation();
    }
}
