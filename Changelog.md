## Version 1.0

    Proper ESPHome YAML Format:
        Removed the lambda syntax entirely
        Used proper ESPHome configuration structure
        Added display and touchscreen configurations
        Formatted widget definitions in standard ESPHome style

    Complete Widget Support:
        All widget types properly configured
        Type-specific properties handled correctly
        Proper indentation and formatting

    Realistic Configuration:
        Added example hardware configuration (ILI9341 display, XPT2046 touchscreen)
        Included realistic pin assignments
        Added calibration values for touchscreen

    Clean Output:
        Commented sections for clarity
        Proper spacing and organization
        Ready-to-use ESPHome configuration

## Version 1.1

    Dark Mode Implementation:
        Added a state variable darkMode to track the current theme
        Created theme-specific CSS classes for all UI elements
        Implemented a toggle button at the bottom to switch between themes

    Theme-Specific Styling:
        Background colors adjusted for both light and dark modes
        Text colors optimized for readability in both themes
        Card and border colors adapted for each theme
        Input fields and text areas styled appropriately

    Theme Toggle Button:
        Positioned at the bottom center of the screen
        Shows Sun icon for dark mode (switch to light)
        Shows Moon icon for light mode (switch to dark)
        Clear labeling for user understanding

    Consistent UI Experience:
        All components adapt to the selected theme
        Modal dialog also follows the theme
        Proper contrast maintained in both modes
        Smooth visual transition between themes


## Version 1.2

Key improvements in this version:

    Background Color Control:
        Added a new "Display Settings" section in the widget palette
        Included a color picker with both visual swatch and text input
        Added Palette icon for visual identification

    Live Canvas Background:
        The canvas background color updates in real-time as you change the color
        Uses the selected color for the actual design canvas visualization

    ESPHome YAML Integration:
        Added background color configuration to the generated YAML
        Uses LVGL's lv_obj_set_style_bg_color and lv_obj_set_style_bg_opa functions
        Properly formats the hex color value for LVGL

    User Experience Improvements:
        Clear labeling of the background color section
        Dual input method (color picker + text field)
        Real-time visual feedback on the canvas
        Properly formatted YAML output with comments


## Version 1.3

    Smaller Dark Mode Toggle:
        Changed the theme toggle button to a small icon-only button
        Used variant="ghost" and size="sm" for a more compact appearance
        Only shows the Sun or Moon icon without text
        Reduced padding for a smaller footprint

    GitHub Footer Link:
        Added a footer section at the bottom of the page
        Included a link to "C0deIRL Github" pointing to https://github.com/c0deirl
        Styled the link with hover effects for better UX
        Positioned the link on the left side of the footer

    Improved Layout:
        Footer now has a clean, minimal design
        Theme toggle is on the right side of the footer
        Proper spacing and alignment in the footer area
        Consistent styling with the rest of the application

The dark mode toggle is now much smaller and only shows the icon, while the GitHub link is clearly visible in the footer. Both elements are positioned appropriately without taking up too much space.

## Version 1.4

Key improvements in this version:

    Welcome Popup:
        Added a modal that appears on first visit
        Contains the exact message about ESP32-2432S028R compatibility
        Can be dismissed with a "Got it" button

    Dark Mode by Default:
        Changed the initial state of darkMode to true
        Set default background color to a dark slate blue (#1e293b)

    Zoom Functionality:
        Added zoom in/out buttons in the display settings panel
        Included a reset zoom button showing current zoom percentage
        Implemented zoom logic that scales the canvas and widgets
        Zoom levels range from 50% to 300%
        Widgets maintain their positions relative to the canvas during zoom

    Improved UI:
        Zoom controls are clearly labeled and accessible
        Welcome modal has a clean, modern design
        All components adapt to dark/light mode consistently

