# Node Processing Extension

## Description
This extension provides functionality to process specific DOM nodes based on their class names. It is designed to handle elements dynamically and perform operations such as querying, modifying, and logging.

## Features
- Process nodes with specific class names (`REACT_VIRTUALIZED_GRID`, `MESSAGE_VIEW_SCROLL_INNER`, etc.).
- Handle sibling nodes with `MESSAGE_ACTION` class.
- Query and manipulate elements within nodes.
- Log processing details for debugging purposes.

## Installation
- Clone the repository:
   ```bash
   git clone <repository-url>
   ```

## Usage
1. Import the extension into your project.
2. Call the provided functions to process nodes:
    - processTargetNode(node)
    - processNextSiblingNode(node)
    - processNodeElement(node)
    - Ensure the DOM structure includes the required class names for processing.
3. Ensure the DOM structure includes the required class names for processing.

## Example
    ```
    const node = document.querySelector('.react-virtualized-grid');
    processTargetNode(node);
    ```

## Configuration
- Update class name constants (REACT_VIRTUALIZED_GRID, MESSAGE_ACTION, etc.) as per your DOM structure.
- Modify processing logic in processNodeElement or related functions to suit your requirements.

## Contributing
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with detailed information about your changes.

## License
- This project is licensed under the MIT License. See the LICENSE file for details.
