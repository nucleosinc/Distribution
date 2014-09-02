<?php

namespace Claroline\CoreBundle\Migrations\sqlsrv;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2014/09/02 01:53:49
 */
class Version20140902135346 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE claro_widget_badge_usage_config (
                id INT IDENTITY NOT NULL, 
                numberAwardedBadge SMALLINT NOT NULL, 
                widgetInstance_id INT, 
                PRIMARY KEY (id)
            )
        ");
        $this->addSql("
            CREATE INDEX IDX_9A2EA78BAB7B5A55 ON claro_widget_badge_usage_config (widgetInstance_id)
        ");
        $this->addSql("
            ALTER TABLE claro_widget_badge_usage_config 
            ADD CONSTRAINT FK_9A2EA78BAB7B5A55 FOREIGN KEY (widgetInstance_id) 
            REFERENCES claro_widget_instance (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP TABLE claro_widget_badge_usage_config
        ");
    }
}