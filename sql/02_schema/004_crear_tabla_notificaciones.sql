USE AulaComparte;
GO

IF OBJECT_ID('dbo.notifications', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.notifications (
        id INT IDENTITY(1,1) NOT NULL CONSTRAINT pk_notifications PRIMARY KEY,
        user_id INT NOT NULL,
        resource_id INT NULL,
        title VARCHAR(200) NOT NULL,
        message VARCHAR(1500) NOT NULL,
        type VARCHAR(50) NOT NULL,
        is_read BIT NOT NULL CONSTRAINT df_notifications_is_read DEFAULT 0,
        created_at DATETIME NOT NULL CONSTRAINT df_notifications_created_at DEFAULT SYSDATETIME(),

        CONSTRAINT fk_notifications_user_id
            FOREIGN KEY (user_id) REFERENCES dbo.users(id),
        CONSTRAINT fk_notifications_resource_id
            FOREIGN KEY (resource_id) REFERENCES dbo.resources(id),
        CONSTRAINT ck_notifications_type
            CHECK (type IN ('resource_approved', 'resource_rejected'))
    );

    CREATE INDEX ix_notifications_user_id ON dbo.notifications(user_id);
    CREATE INDEX ix_notifications_is_read ON dbo.notifications(is_read);
    CREATE INDEX ix_notifications_created_at ON dbo.notifications(created_at);
END;
GO
