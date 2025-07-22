# Auto Sidebar Flow

Enhance your Obsidian experience with the **Auto Sidebar Flow** plugin, which automatically opens sidebars when you hover near the edges. This plugin offers smooth transitions, customizable settings, and innovative features like collapsible ribbon integration, making navigation more intuitive and efficient.

## Demo Video or GIF

![Demo](https://github.com/maurocarduz/auto-sidebar-flow/blob/main/DEMO.gif)

## Features

- **Automatic Sidebar Opening**: Hover near the left or right edge to seamlessly open the respective sidebar.
- **Collapsible Ribbon**: The left toolbar (ribbon) can collapse and expand along with the left sidebar, providing a cleaner interface (toggleable in settings).
- **Customizable Delays**: Adjust the collapse delay (minimum 1000ms) and expand delay to suit your workflow.
- **Sync Sidebars**: Optionally sync both sidebars to open with a single hover action.
- **Hide Toggle Buttons**: Remove manual toggle buttons for a minimalist look.
- **Adjustable Widths and Speeds**: Customize sidebar widths and animation speeds for a personalized experience.
- **Fixed Search Functionality**: Ensures search menus and context menus work smoothly without triggering unwanted collapses.
- **Click Outside to Close**: Clicking outside the safe areas (sidebars and hover zones) will close the sidebars, enhancing control over their visibility.

## Installation

1. Download the latest release from the [Releases](https://github.com/maurocarduz/auto-sidebar-flow/releases) page.
2. Place the `auto-sidebar-flow` folder in your Obsidian vault under `.obsidian/plugins/`.
3. Enable the plugin in Obsidian's settings under "Community Plugins."

## Usage

- **Hover Navigation**: Move your mouse near the left or right edge to open the sidebars automatically.
- **Settings Adjustment**: Access the plugin settings tab to tweak hover distances, delays, widths, and ribbon behavior.
- **Ribbon Control**: Enable or disable the ribbon's collapse with the left sidebar for a clutter-free workspace.

## Recent Updates and Corrections

### Corrections Applied
- **Search Bar Area Safety**: Fixed an issue where the search bar area was not recognized as a safe area, causing the sidebar to collapse when moving the mouse between tab headers. The hover logic was updated to consistently maintain openness.
- **Hover Consistency**: Resolved an issue where the sidebar would collapse when moving the mouse between tab headers. The hover logic was aligned between left and right sidebars to maintain openness during navigation.

### New Features Implemented
- **Collapsible Ribbon (v1.0.0+)**: Introduced the option to collapse the left ribbon alongside the left sidebar, enhancing the minimalist design. This feature is toggleable via settings and preserves the original ribbon display when disabled.
- **Enhanced Hover Detection**: Improved the plugin to recognize the right toggle button as a safe area when the sidebar is open, reducing accidental collapses.

## Development

- **Author**: Mauro Carduz
- **Source**: [GitHub Repository](https://github.com/maurocarduz/auto-sidebar-flow)

## Default Settings
The plugin initializes with the following settings, adjustable in the plugin settings tab:
- Left Sidebar: Enabled
- Right Sidebar: Enabled
- Sync Sidebars: Disabled
- Collapse Delay: 3000ms (minimum 1000ms)
- Expand Delay: 100ms
- Left Hover Distance: 10px
- Right Hover Distance: 10px
- Animation Speed: 200ms
- Left Sidebar Width: 350px
- Right Sidebar Width: 400px
- Hide Toggle Buttons: Disabled
- Keep Ribbon Visible: Disabled

# Auto Sidebar Flow

Enhance your Obsidian experience with the **Auto Sidebar Flow** plugin, which automatically opens sidebars when you hover near the edges. This plugin offers smooth transitions, customizable settings, and innovative features like collapsible ribbon integration, making navigation more intuitive and efficient.

## Demo Video or GIF

![Demo](https://github.com/maurocarduz/auto-sidebar-flow/blob/main/DEMO.gif)

## Features

- **Automatic Sidebar Opening**: Hover near the left or right edge to seamlessly open the respective sidebar.
- **Collapsible Ribbon**: The left toolbar (ribbon) can collapse and expand along with the left sidebar, providing a cleaner interface (toggleable in settings).
- **Customizable Delays**: Adjust the collapse delay (minimum 1000ms) and expand delay to suit your workflow.
- **Sync Sidebars**: Optionally sync both sidebars to open with a single hover action.
- **Hide Toggle Buttons**: Remove manual toggle buttons for a minimalist look.
- **Adjustable Widths and Speeds**: Customize sidebar widths and animation speeds for a personalized experience.
- **Fixed Search Functionality**: Ensures search menus and context menus work smoothly without triggering unwanted collapses.
- **Click Outside to Close**: Clicking outside the safe areas (sidebars and hover zones) will close the sidebars, enhancing control over their visibility.

## Installation

1. Download the latest release from the [Releases](https://github.com/maurocarduz/auto-sidebar-flow/releases) page.
2. Place the `auto-sidebar-flow` folder in your Obsidian vault under `.obsidian/plugins/`.
3. Enable the plugin in Obsidian's settings under "Community Plugins."

## Usage

- **Hover Navigation**: Move your mouse near the left or right edge to open the sidebars automatically.
- **Settings Adjustment**: Access the plugin settings tab to tweak hover distances, delays, widths, and ribbon behavior.
- **Ribbon Control**: Enable or disable the ribbon's collapse with the left sidebar for a clutter-free workspace.

## Recent Updates and Corrections

### Corrections Applied
- **Search Bar Area Safety**: Fixed an issue where the search bar area was not recognized as a safe area, causing the sidebar to collapse when moving the mouse between tab headers. The hover logic was updated to consistently maintain openness.
- **Hover Consistency**: Resolved an issue where the sidebar would collapse when moving the mouse between tab headers. The hover logic was aligned between left and right sidebars to maintain openness during navigation.

### New Features Implemented
- **Collapsible Ribbon (v1.0.0+)**: Introduced the option to collapse the left ribbon alongside the left sidebar, enhancing the minimalist design. This feature is toggleable via settings and preserves the original ribbon display when disabled.
- **Enhanced Hover Detection**: Improved the plugin to recognize the right toggle button as a safe area when the sidebar is open, reducing accidental collapses.

## Development

- **Author**: Mauro Carduz
- **Source**: [GitHub Repository](https://github.com/maurocarduz/auto-sidebar-flow)

## Default Settings
The plugin initializes with the following settings, adjustable in the plugin settings tab:
- Left Sidebar: Enabled
- Right Sidebar: Enabled
- Sync Sidebars: Disabled
- Collapse Delay: 3000ms (minimum 1000ms)
- Expand Delay: 100ms
- Left Hover Distance: 10px
- Right Hover Distance: 10px
- Animation Speed: 200ms
- Left Sidebar Width: 350px
- Right Sidebar Width: 400px
- Hide Toggle Buttons: Disabled
- Keep Ribbon Visible: Disabled

## Support

If you find this plugin useful, consider supporting its development:

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" width="200">](https://buymeacoffee.com/maurocarduz)   
[<img src="https://img.shields.io/github/sponsors/maurocarduz?logo=github&style=for-the-badge" width="200">](https://github.com/sponsors/maurocarduz)

- **Buy Me a Coffee**: Show your appreciation with a coffee!  
- **GitHub Sponsor**: Become a sponsor to support ongoing development!

## License
This project is licensed under the [MIT License](LICENSE).
