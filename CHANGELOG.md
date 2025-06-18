# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New `chat_agent` and `paper_agent` for handling general chat and research paper interactions
- PostgreSQL database integration for agent storage
- Phoenix monitoring and tracing for observability
- DuckDuckGo search tool to web_agent for enhanced search capabilities
- Arxiv package for research paper functionality

### Changed
- Added unique `agent_id` to all agent configurations for better identification
- Updated dependencies in `requirements.txt` and `requirements-dev.txt`
- Improved environment variable handling with `override=True`
- Replaced `weather_agent` with more versatile agents

### Removed
- Removed `weather_agent` in favor of more specialized agents

### Fixed
- Code formatting and linting issues across multiple files
- Environment variable loading consistency

### Security
- Updated dependencies to their latest secure versions

---
*Note: See the project's commit history for detailed changes.*
