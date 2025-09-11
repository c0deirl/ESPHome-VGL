This LVGL Widget Designer includes:

Drag-and-Drop Canvas:

320x240 pixel design area
Widget placement via drag-and-drop
Visual feedback during dragging
Widget Palette:

Label, Button, Slider, Checkbox, and Image widgets
Visual representation of each widget type
Widget Customization:

Property panel for selected widgets
Position, size, and type-specific properties
Real-time updates on the canvas
ESPHome YAML Generation:

Generates valid ESPHome LVGL configuration
Copy-to-clipboard functionality
Dialog display for generated code
Responsive Design:

Clean layout with sidebar and canvas
Mobile-friendly controls
Intuitive user interface
The implementation uses React state management for widget tracking, drag-and-drop APIs for interaction, and Tailwind CSS for styling. The UI components are from Shadcn UI with Lucide React icons for visual elements.

To use this component:

Drag widgets from the left panel onto the canvas
Click on widgets to select and customize properties
Adjust position, size, and widget-specific attributes
Click "Generate YAML" to create ESPHome configuration code
Copy the generated code to your ESPHome configuration
The design follows LVGL conventions and generates valid YAML that can be directly used in ESPHome projects.


Update 1 :

Background Color Customization:

Added a color picker for the canvas background
Background color is included in the generated YAML with bg_color property
Widget Color Customization:

Added color pickers for:
Background color
Text/indicator color
Border color
Each widget type has default colors that can be overridden
Color changes are reflected in real-time on the canvas
LVGL Color Integration:

Generated YAML includes color styling using lv_obj_set_style_* functions
Colors are converted to hex format for LVGL compatibility
Only custom colors (different from defaults) are included in the YAML
Improved UI:

Added a color palette icon for the color section
Visual color previews next to color pickers
Better organization of properties panel
Enhanced YAML Generation:

Added color_depth: 16 to the display configuration
Background color is set at the display level
Widget-specific colors are applied using LVGL style functions
The implementation follows LVGL conventions and generates valid ESPHome configuration that includes color customization for both the background and individual widgets. Users can now create visually customized interfaces that match their design requirements.


Update 2: 
Realistic Slider Design:

Added a visible slider track with proper styling
Created a draggable knob/thumb element
Implemented filled/unfilled portions of the slider
Added proper shadows and borders for depth
Visual Enhancements:

Knob is now a distinct circular element that moves along the track
Track shows progress with different colors for filled/unfilled portions
Proper padding and alignment for the slider elements
Better visual hierarchy with shadows and borders
Size Adjustments:

Default slider size is now 120x20 pixels (more appropriate for a slider)
Knob size is fixed at 20x20 pixels for better visibility
Proper positioning calculations for the knob based on value
Color Usage:

textColor is now used for the filled portion and knob
borderColor is used for the track background
bgColor is used for the slider container background
Interaction Improvements:

Better visual feedback when selected (blue border)
More realistic representation of an LVGL slider
Proper spacing and alignment of elements
The slider now visually represents a real LVGL slider with a track, progress indicator, and draggable knob, making it much more intuitive for users to understand and design with.


Update 3

Visual Delete Button:

Added a red "X" button that appears on the top-right corner of selected widgets
Positioned absolutely outside the widget boundary for better visibility
Styled with a red background and white icon for clear visual indication
Direct Deletion:

Clicking the "X" button immediately deletes the widget from the canvas
No need to go to the properties panel to delete
Works for all widget types
Enhanced User Experience:

Delete button only appears when a widget is selected
Button has hover effects for better interactivity
Stops event propagation to prevent widget selection when deleting
Visual feedback with hover state changes
Maintained Existing Functionality:

Kept the delete button in the properties panel for consistency
Both methods work independently
Selection is cleared after deletion
The delete button provides a more intuitive way to remove widgets directly from the canvas preview, improving the overall user experience. The button is only visible when a widget is selected, keeping the interface clean when not in use.

Update 4 :

Added widget types from ESPHome LVGL documentation:

Switch - A toggle switch widget with visual on/off states
Arc - A circular progress indicator with percentage display
Bar - A horizontal progress bar
Roller - A vertical scrolling selector with up/down controls
Dropdown - A dropdown selection menu
Key improvements:

New Widget Visuals:

Switch: Toggle-style control with sliding indicator
Arc: Circular progress with percentage display
Bar: Horizontal progress bar
Roller: Vertical selector with navigation controls
Dropdown: Select menu with dropdown indicator
Enhanced Properties:

Min/max values for slider, arc, and bar widgets
Rotation angle for arc widgets
Options list for roller and dropdown widgets
Selected index for option-based widgets
Updated YAML Generation:

Added support for new widget properties
Proper handling of options for roller/dropdown
Min/max value support for range widgets
Rotation property for arc widgets
Improved UI:

Lucide React icons for widget types
Better default sizes for each widget type
More intuitive property controls
Visual feedback for all widget states
Maintained Functionality:

All existing widgets still work as before
Drag-and-drop placement
Property customization
Direct deletion from canvas
ESPHome YAML generation
The designer now supports all major LVGL widgets available in ESPHome, providing a comprehensive tool for designing TFT interfaces.
