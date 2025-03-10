-- Team Members table with project relationship
CREATE TABLE team_members (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    daily_cost DECIMAL(10, 2) NOT NULL,
    wallet_address VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Third Party Services table with project relationship
CREATE TABLE third_party_services (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    monthly_cost DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Milestones table with project relationship
CREATE TABLE milestones (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    date_range_start DATE NOT NULL,
    date_range_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Deliverables table (child of Milestones)
CREATE TABLE deliverables (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    milestone_id BIGINT REFERENCES milestones(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for Milestones and Team Members (many-to-many)
CREATE TABLE milestone_team_members (
    milestone_id BIGINT REFERENCES milestones(id) ON DELETE CASCADE,
    team_member_id BIGINT REFERENCES team_members(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (milestone_id, team_member_id)
);

-- Junction table for Milestones and Services (many-to-many)
CREATE TABLE milestone_services (
    milestone_id BIGINT REFERENCES milestones(id) ON DELETE CASCADE,
    service_id BIGINT REFERENCES third_party_services(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (milestone_id, service_id)
);