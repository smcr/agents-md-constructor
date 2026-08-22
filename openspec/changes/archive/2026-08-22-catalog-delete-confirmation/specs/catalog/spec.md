## ADDED Requirements

### Requirement: Confirm before deleting a catalog record
On the Справочники page, clicking **Удалить** for a Section, Rule, Tag, or User SHALL ask the user to confirm the deletion before any delete request is sent. The prompt MUST be visible and MUST offer confirm and cancel. Detaching a Tag from a Section or Rule MUST NOT require this confirmation.

If the user confirms, the system MUST delete that record using the existing delete behavior (including existing failures, such as deleting a Section that still has Rules). If the user cancels, the system MUST NOT send a delete request and MUST leave the record unchanged.

#### Scenario: Confirm deletes the record
- **WHEN** the user clicks Удалить on a Rule and confirms
- **THEN** that Rule is deleted

#### Scenario: Cancel keeps the record
- **WHEN** the user clicks Удалить on a Tag and cancels
- **THEN** that Tag remains and no delete request is sent

#### Scenario: Confirmation is required for each catalog entity
- **WHEN** the user clicks Удалить on a Section, Rule, Tag, or User
- **THEN** a confirmation prompt is shown before any delete request

#### Scenario: Detach Tag is not confirmed
- **WHEN** the user detaches a Tag from a Section or Rule
- **THEN** the association is removed without the delete-confirmation prompt
