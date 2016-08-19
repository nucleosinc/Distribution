<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Twig;

use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bridge\Twig\Extension\AssetExtension;

/**
 * @DI\Service("claroline.extension.webpack")
 * @DI\Tag("twig.extension")
 */
class WebpackExtension extends \Twig_Extension
{
    private $assetExtension;
    private $environment;
    private $rootDir;
    private $assetCache;

    /**
     * @DI\InjectParams({
     *     "extension"      = @DI\Inject("twig.extension.assets"),
     *     "environment"    = @DI\Inject("%kernel.environment%"),
     *     "rootDir"        = @DI\Inject("%kernel.root_dir%")
     * })
     *
     * @param AssetExtension $extension
     * @param string         $environment
     * @param string         $rootDir
     */
    public function __construct(AssetExtension $extension, $environment, $rootDir)
    {
        $this->assetExtension = $extension;
        $this->environment = $environment;
        $this->rootDir = $rootDir;
    }

    public function getFunctions()
    {
        return [
            'hotAsset' => new \Twig_Function_Method($this, 'hotAsset'),
        ];
    }

    public function getName()
    {
        return 'webpack_extension';
    }

    /**
     * Returns the URL of an asset managed by webpack. The final URL will depend
     * on the environment and the version hash generated by webpack.
     *
     * @param string $path
     *
     * @return string
     */
    public function hotAsset($path)
    {
        $assets = $this->getWebpackAssets();
        $assetName = pathinfo($path, PATHINFO_FILENAME);

        if (!property_exists($assets, $assetName)) {
            $assetNames = implode("\n", array_keys((array) $assets));

            throw new \Exception(
                "Cannot find asset '{$assetName}' in webpack stats. Found:\n{$assetNames})"
            );
        }

        $asset = 'dist/'.$assets->{$assetName}->js;

        /*if ($this->environment === 'dev') {
            return "http://localhost:8080/{$asset}";
        }*/

        return $this->assetExtension->getAssetUrl($asset);
    }

    private function getWebpackAssets()
    {
        if (!$this->assetCache) {
            $assetFile = realpath("{$this->rootDir}/../webpack-assets.json");

            if (!file_exists($assetFile)) {
                throw new \Exception(sprintf(
                    'Cannot find webpack assets file (looked for %s). Make sure assets-webpack-plugin is enabled',
                    $assetFile
                ));
            }

            $this->assetCache = json_decode(file_get_contents($assetFile));
        }

        return $this->assetCache;
    }
}
