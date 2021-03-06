<?php

namespace Claroline\CoreBundle\API\Transfer\Adapter\Explain\Csv;

class Explanation
{
    public function __construct(array $properties = [])
    {
        $this->properties = $properties;
    }

    public function addProperty($name, $type, $description, $required, $isArray = false)
    {
        $this->properties[] = new Property($name, $type, $description, $required, $isArray);
    }

    public function getProperties()
    {
        return $this->properties;
    }

    public function getProperty($name)
    {
        foreach ($this->properties as $property) {
            if ($property instanceof Property) {
                if ($property->getName() === $name) {
                    return $property;
                }
            } elseif ($property instanceof OneOf) {
                $explanations = $property->getExplanations();
                $foundProperty = null;

                foreach ($explanations as $explanation) {
                    if (!$foundProperty) {
                        $foundProperty = $explanation->getProperty($name);
                        if ($foundProperty) {
                            return $foundProperty;
                        }
                    }
                }
            }
        }
    }

    public function addOneOf(array $properties, $description)
    {
        $this->properties[] = new OneOf($properties, $description, true);
    }
}
