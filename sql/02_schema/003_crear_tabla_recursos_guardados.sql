USE AulaComparte;
GO

IF OBJECT_ID('dbo.saved_resources', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.saved_resources (
        user_id INT NOT NULL,
        resource_id INT NOT NULL,
        created_at DATETIME NOT NULL CONSTRAINT df_saved_resources_created_at DEFAULT SYSDATETIME(),
        CONSTRAINT pk_saved_resources PRIMARY KEY (user_id, resource_id),
        CONSTRAINT fk_saved_resources_users FOREIGN KEY (user_id) REFERENCES dbo.users(id),
        CONSTRAINT fk_saved_resources_resources FOREIGN KEY (resource_id) REFERENCES dbo.resources(id)
    );

    CREATE INDEX ix_saved_resources_user_id ON dbo.saved_resources(user_id);
    CREATE INDEX ix_saved_resources_resource_id ON dbo.saved_resources(resource_id);
END;
GO
