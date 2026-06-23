USE AulaComparte;
GO

IF OBJECT_ID('dbo.resources', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.resources (
        id INT IDENTITY(1,1) NOT NULL CONSTRAINT pk_resources PRIMARY KEY,
        owner_id INT NOT NULL,
        title VARCHAR(200) NOT NULL,
        description VARCHAR(MAX) NOT NULL,
        resource_type VARCHAR(30) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        education_level VARCHAR(30) NOT NULL,
        format VARCHAR(30) NOT NULL,
        author VARCHAR(120) NOT NULL,
        file_path VARCHAR(500) NULL,
        external_url VARCHAR(1000) NULL,
        material_reference VARCHAR(500) NULL,
        page_count INT NULL,
        image_count INT NULL,
        permission_declared BIT NOT NULL,
        report_reason VARCHAR(1000) NULL,
        status VARCHAR(20) NOT NULL CONSTRAINT df_resources_status DEFAULT 'pending',
        downloads INT NOT NULL CONSTRAINT df_resources_downloads DEFAULT 0,
        created_at DATETIME NOT NULL CONSTRAINT df_resources_created_at DEFAULT SYSDATETIME(),
        CONSTRAINT fk_resources_users FOREIGN KEY (owner_id) REFERENCES dbo.users(id),
        CONSTRAINT ck_resources_type CHECK (resource_type IN ('book', 'notes', 'guide', 'exercises', 'slides', 'exam')),
        CONSTRAINT ck_resources_education_level CHECK (education_level IN ('primary', 'secondary', 'preuniversity', 'university')),
        CONSTRAINT ck_resources_format CHECK (format IN ('pdf', 'image', 'document', 'link', 'physical')),
        CONSTRAINT ck_resources_status CHECK (status IN ('pending', 'approved', 'rejected', 'reported')),
        CONSTRAINT ck_resources_downloads_nonnegative CHECK (downloads >= 0),
        CONSTRAINT ck_resources_page_count_nonnegative CHECK (page_count IS NULL OR page_count >= 0),
        CONSTRAINT ck_resources_image_count_nonnegative CHECK (image_count IS NULL OR image_count >= 0)
    );
    CREATE INDEX ix_resources_owner_id ON dbo.resources(owner_id);
    CREATE INDEX ix_resources_status ON dbo.resources(status);
    CREATE INDEX ix_resources_created_at ON dbo.resources(created_at);
END;
GO
