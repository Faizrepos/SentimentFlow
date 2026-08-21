CREATE DATABASE IF NOT EXISTS sentimentflow;

USE sentimentflow;

CREATE TABLE IF NOT EXISTS analyses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    sentiment VARCHAR(20) NOT NULL,
    positive_score DECIMAL(5,2) NOT NULL,
    negative_score DECIMAL(5,2) NOT NULL,
    neutral_score DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at),
    INDEX idx_sentiment (sentiment)
);
