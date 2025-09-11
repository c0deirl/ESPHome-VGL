"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Download, Trash2, X, Sun, Moon, Palette, ZoomIn, ZoomOut } from "lucide-react";

// Define widget types
type WidgetType = 'label' | 'button' | 'slider' | 'checkbox' | 'image' | 'arc' | 'bar' | 'roller';

interface Widget {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  value?: number;
  min?: number;
  max?: number;
  options?: string;
  checked?: boolean;
  src?: string;
  startAngle?: number;
  endAngle?: number;
}

export default function LVGLWidgetDesigner() {
  // State for widgets and canvas
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [draggingWidget, setDraggingWidget] = useState<WidgetType | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [yamlOutput, setYamlOutput] = useState('');
  const [showYamlModal, setShowYamlModal] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#1e293b');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Available widget types
  const widgetTypes: { type: WidgetType; name: string; icon: React.ReactNode }[] = [
    { type: 'label', name: 'Label', icon: <div className="w-4 h-4 bg-blue-500 rounded-sm" /> },
    { type: 'button', name: 'Button', icon: <div className="w-4 h-4 bg-green-500 rounded" /> },
    { type: 'slider', name: 'Slider', icon: <div className="w-4 h-4 bg-yellow-500 rounded-full" /> },
    { type: 'checkbox', name: 'Checkbox', icon: <div className="w-4 h-4 bg-purple-500 border-2 border-white" /> },
    { type: 'image', name: 'Image', icon: <div className="w-4 h-4 bg-pink-500" /> },
    { type: 'arc', name: 'Arc', icon: <div className="w-4 h-4 bg-indigo-500 rounded-full border-2 border-indigo-700" /> },
    { type: 'bar', name: 'Bar', icon: <div className="w-4 h-4 bg-teal-500" /> },
    { type: 'roller', name: 'Roller', icon: <div className="w-4 h-4 bg-orange-500 border border-gray-800" /> },
  ];

  // Handle drag start from widget palette
  const handleDragStart = (type: WidgetType) => {
    setDraggingWidget(type);
  };

  // Handle drag over canvas
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop on canvas
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current || !draggingWidget) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoomLevel;
    const y = (e.clientY - rect.top) / zoomLevel;

    // Create new widget with default properties
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: draggingWidget,
      x: Math.max(0, x - 25),
      y: Math.max(0, y - 15),
      width: draggingWidget === 'slider' || draggingWidget === 'bar' ? 100 : 50,
      height: draggingWidget === 'arc' ? 50 : 30,
      ...(draggingWidget === 'label' && { text: 'Label' }),
      ...(draggingWidget === 'button' && { text: 'Button' }),
      ...(draggingWidget === 'slider' && { value: 50, min: 0, max: 100 }),
      ...(draggingWidget === 'checkbox' && { checked: false }),
      ...(draggingWidget === 'image' && { src: '' }),
      ...(draggingWidget === 'arc' && { value: 70, min: 0, max: 100, startAngle: 0, endAngle: 270 }),
      ...(draggingWidget === 'bar' && { value: 50, min: 0, max: 100 }),
      ...(draggingWidget === 'roller' && { options: 'Option 1\nOption 2\nOption 3', value: 0 }),
    };

    setWidgets([...widgets, newWidget]);
    setSelectedWidget(newWidget);
    setDraggingWidget(null);
  };

  // Handle widget selection
  const handleWidgetClick = (widget: Widget, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWidget(widget);
  };

  // Handle widget drag start
  const handleWidgetDragStart = (widget: Widget, e: React.DragEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setSelectedWidget(widget);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: (e.clientX - rect.left) / zoomLevel,
      y: (e.clientY - rect.top) / zoomLevel
    });
  };

  // Handle widget drag
  const handleWidgetDrag = (e: React.DragEvent) => {
    if (!isDragging || !selectedWidget || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoomLevel - dragOffset.x;
    const y = (e.clientY - rect.top) / zoomLevel - dragOffset.y;
    
    setWidgets(widgets.map(w => 
      w.id === selectedWidget.id 
        ? { ...w, x: Math.max(0, Math.min(320 - w.width, x)), y: Math.max(0, Math.min(240 - w.height, y)) } 
        : w
    ));
  };

  // Handle widget drag end
  const handleWidgetDragEnd = () => {
    setIsDragging(false);
  };

  // Update widget property
  const updateWidgetProperty = (property: string, value: string | number | boolean) => {
    if (!selectedWidget) return;
    
    const updatedWidget = { ...selectedWidget, [property]: value };
    setSelectedWidget(updatedWidget);
    
    setWidgets(widgets.map(w => 
      w.id === selectedWidget.id ? updatedWidget : w
    ));
  };

  // Delete selected widget
  const deleteWidget = () => {
    if (!selectedWidget) return;
    
    setWidgets(widgets.filter(w => w.id !== selectedWidget.id));
    setSelectedWidget(null);
  };

  // Generate ESPHome YAML
  const generateYAML = () => {
    let yaml = `# ESPHome LVGL Display Configuration\n`;
    yaml += `# Generated by ESPHome LVGL Widget Designer\n\n`;
    
    yaml += `display:\n`;
    yaml += `  - platform: ili9341\n`;
    yaml += `    model: TFT_2.4\n`;
    yaml += `    cs_pin: GPIO5\n`;
    yaml += `    dc_pin: GPIO16\n`;
    yaml += `    led_pin: GPIO2\n`;
    yaml += `    reset_pin: GPIO17\n`;
    yaml += `    rotation: 0\n`;
    yaml += `    update_interval: 16ms\n\n`;
    
    yaml += `  - platform: lvgl\n`;
    yaml += `    id: tft_display\n`;
    yaml += `    display: ili9341\n`;
    yaml += `    buffer_size: 32KB\n`;
    yaml += `    touchscreens:\n`;
    yaml += `      - platform: xpt2046\n`;
    yaml += `        id: touchscreen\n`;
    yaml += `        cs_pin: GPIO27\n`;
    yaml += `        irq_pin: GPIO25\n`;
    yaml += `        calibration_x_min: 3800\n`;
    yaml += `        calibration_x_max: 240\n`;
    yaml += `        calibration_y_min: 3800\n`;
    yaml += `        calibration_y_max: 240\n`;
    yaml += `        swap_xy: false\n`;
    yaml += `        invert_x: false\n`;
    yaml += `        invert_y: false\n\n`;
    
    // Add background color configuration
    yaml += `    # Set background color\n`;
    yaml += `    on_setup:\n`;
    yaml += `      then:\n`;
    yaml += `        - lambda: |\n`;
    yaml += `            lv_obj_set_style_bg_color(lv_scr_act(), lv_color_hex(0x${backgroundColor.replace('#', '')}), 0);\n`;
    yaml += `            lv_obj_set_style_bg_opa(lv_scr_act(), LV_OPA_COVER, 0);\n\n`;
    
    yaml += `# Widget Definitions\n`;
    widgets.forEach(widget => {
      yaml += `  - platform: lvgl\n`;
      yaml += `    type: ${widget.type}\n`;
      yaml += `    id: ${widget.id}\n`;
      yaml += `    x: ${widget.x}\n`;
      yaml += `    y: ${widget.y}\n`;
      yaml += `    width: ${widget.width}\n`;
      yaml += `    height: ${widget.height}\n`;
      
      switch (widget.type) {
        case 'label':
        case 'button':
          yaml += `    text: "${widget.text || ''}"\n`;
          break;
          
        case 'slider':
        case 'bar':
          yaml += `    min_value: ${widget.min || 0}\n`;
          yaml += `    max_value: ${widget.max || 100}\n`;
          yaml += `    value: ${widget.value || 0}\n`;
          break;
          
        case 'checkbox':
          yaml += `    checked: ${widget.checked ? 'true' : 'false'}\n`;
          break;
          
        case 'arc':
          yaml += `    min_value: ${widget.min || 0}\n`;
          yaml += `    max_value: ${widget.max || 100}\n`;
          yaml += `    value: ${widget.value || 0}\n`;
          yaml += `    start_angle: ${widget.startAngle || 0}\n`;
          yaml += `    end_angle: ${widget.endAngle || 270}\n`;
          break;
          
        case 'roller':
          yaml += `    options: |\n`;
          (widget.options || '').split('\n').forEach(option => {
            yaml += `      ${option}\n`;
          });
          yaml += `    selected: ${widget.value || 0}\n`;
          break;
      }
      
      yaml += `\n`;
    });
    
    setYamlOutput(yaml);
    setShowYamlModal(true);
  };

  // Zoom functions
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  // Render widget based on type
  const renderWidget = (widget: Widget) => {
    const isSelected = selectedWidget?.id === widget.id;
    const baseClasses = `absolute cursor-move border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'}`;
    
    switch (widget.type) {
      case 'label':
        return (
          <div
            className={`${baseClasses} flex items-center justify-center bg-white text-black border border-gray-300`}
            style={{ 
              left: widget.x, 
              top: widget.y, 
              width: widget.width, 
              height: widget.height,
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top left'
            }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(widget, e)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            <span className="text-xs truncate px-1">{widget.text}</span>
          </div>
        );
        
      case 'button':
        return (
          <div
            className={`${baseClasses} flex items-center justify-center bg-blue-500 text-white rounded`}
            style={{ 
              left: widget.x, 
              top: widget.y, 
              width: widget.width, 
              height: widget.height,
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top left'
            }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(widget, e)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            <span className="text-xs truncate px-1">{widget.text}</span>
          </div>
        );
        
      case 'slider':
        // Calculate knob position (0-100% range)
        const knobPosition = widget.value !== undefined ? 
          Math.max(0, Math.min(100, widget.value)) : 50;
        
        return (
          <div
            className={`${baseClasses} flex items-center`}
            style={{ 
              left: widget.x, 
              top: widget.y, 
              width: widget.width, 
              height: widget.height,
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top left'
            }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(widget, e)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            {/* Slider track */}
            <div className="absolute inset-0 bg-gray-300 rounded-full overflow-hidden">
              {/* Active track */}
              <div 
                className="absolute top-0 left-0 h-full bg-blue-500" 
                style={{ width: `${knobPosition}%` }}
              />
            </div>
            
            {/* Slider knob */}
            <div 
              className="absolute w-4 h-4 bg-white rounded-full border-2 border-gray-400 shadow transform -translate-x-1/2"
              style={{ left: `${knobPosition}%` }}
            />
          </div>
        );
        
      case 'checkbox':
        return (
          <div
            className={`${baseClasses} flex items-center justify-center bg-white border rounded`}
            style={{ 
              left: widget.x, 
              top: widget.y, 
              width: widget.width, 
              height: widget.height,
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top left'
            }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(widget, e)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            {widget.checked && <div className="w-3/4 h-3/4 bg-blue-500 rounded-sm" />}
          </div>
        );
        
      case 'image':
        return (
          <div
            className={`${baseClasses} flex items-center justify-center bg-gray-100`}
            style={{ 
              left: widget.x, 
              top: widget.y, 
              width: widget.width, 
              height: widget.height,
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top left'
            }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(widget, e)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
              <span className="text-xs">IMG</span>
            </div>
          </div>
        );
        
      case 'arc':
        return (
          <div
            className={`${baseClasses} rounded-full border-4 border-gray-300`}
            style={{ 
              left: widget.x, 
              top: widget.y, 
              width: widget.width, 
              height: widget.height,
              borderTopColor: '#3b82f6',
              borderRightColor: '#3b82f6',
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top left'
            }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(widget, e)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          />
        );
        
      case 'bar':
        return (
          <div
            className={`${baseClasses} bg-gray-200 rounded`}
            style={{ 
              left: widget.x, 
              top: widget.y, 
              width: widget.width, 
              height: widget.height,
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top left'
            }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(widget, e)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            <div 
              className="h-full bg-blue-500 rounded" 
              style={{ width: `${widget.value || 0}%` }}
            />
          </div>
        );
        
      case 'roller':
        return (
          <div
            className={`${baseClasses} bg-white border border-gray-300 rounded flex items-center justify-center`}
            style={{ 
              left: widget.x, 
              top: widget.y, 
              width: widget.width, 
              height: widget.height,
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top left'
            }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(widget, e)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            <div className="text-xs text-gray-500 truncate px-1">Roller</div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Theme classes
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textClass = darkMode ? 'text-white' : 'text-gray-800';
  const cardClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const sidebarClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const canvasBgClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300';
  const headerClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const widgetPaletteClass = darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200';
  const canvasAreaClass = darkMode ? 'bg-gray-900' : 'bg-gray-100';

  return (
    <div className={`flex flex-col h-screen ${bgClass} ${textClass}`}>
      {/* Header */}
      <header className={`${headerClass} border-b p-4`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">ESPHome LVGL Widget Designer</h1>
          <div className="flex gap-2">
            <Button onClick={generateYAML}>
              <Download className="mr-2 h-4 w-4" />
              Generate YAML
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Widget Palette */}
        <div className={`w-64 ${sidebarClass} border-r p-4 overflow-y-auto`}>
          <h2 className="text-lg font-semibold mb-4">Widgets</h2>
          <div className="space-y-2">
            {widgetTypes.map((widget) => (
              <div
                key={widget.type}
                draggable
                onDragStart={() => handleDragStart(widget.type)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-move transition-colors ${widgetPaletteClass}`}
              >
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded">
                  {widget.icon}
                </div>
                <span>{widget.name}</span>
              </div>
            ))}
          </div>

          {/* Background Color Control */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Display Settings</h2>
            <div className={`${cardClass} border rounded-lg p-4`}>
              <div className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Background Color
                  </Label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className={`flex-1 p-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600" : ""}`}
                      placeholder="#1e293b"
                    />
                  </div>
                </div>
                
                {/* Zoom Controls */}
                <div>
                  <Label>Zoom Controls</Label>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      onClick={zoomOut} 
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={resetZoom} 
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      {Math.round(zoomLevel * 100)}%
                    </Button>
                    <Button 
                      onClick={zoomIn} 
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Panel */}
          {selectedWidget && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Widget Properties</h2>
              <div className={`${cardClass} border rounded-lg`}>
                <div className="p-4 space-y-4">
                  <div>
                    <Label>Position</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">X</Label>
                        <input
                          type="number"
                          value={selectedWidget.x}
                          onChange={(e) => updateWidgetProperty('x', parseInt(e.target.value) || 0)}
                          className={`w-full p-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600" : ""}`}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Y</Label>
                        <input
                          type="number"
                          value={selectedWidget.y}
                          onChange={(e) => updateWidgetProperty('y', parseInt(e.target.value) || 0)}
                          className={`w-full p-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600" : ""}`}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Size</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Width</Label>
                        <input
                          type="number"
                          value={selectedWidget.width}
                          onChange={(e) => updateWidgetProperty('width', parseInt(e.target.value) || 0)}
                          className={`w-full p-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600" : ""}`}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Height</Label>
                        <input
                          type="number"
                          value={selectedWidget.height}
                          onChange={(e) => updateWidgetProperty('height', parseInt(e.target.value) || 0)}
                          className={`w-full p-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600" : ""}`}
                        />
                      </div>
                    </div>
                  </div>

                  {(selectedWidget.type === 'label' || selectedWidget.type === 'button') && (
                    <div>
                      <Label>Text</Label>
                      <input
                        value={selectedWidget.text || ''}
                        onChange={(e) => updateWidgetProperty('text', e.target.value)}
                        className={`w-full p-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600" : ""}`}
                      />
                    </div>
                  )}

                  {(selectedWidget.type === 'slider' || selectedWidget.type === 'bar' || selectedWidget.type === 'arc') && (
                    <>
                      <div>
                        <Label>Value</Label>
                        <input
                          type="number"
                          value={selectedWidget.value || 0}
                          onChange={(e) => updateWidgetProperty('value', parseInt(e.target.value) || 0)}
                          className={`w-full p-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600" : ""}`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Min</Label>
                          <input
                            type="number"
                            value={selectedWidget.min || 0}
                            onChange={(e) => updateWidgetProperty('min', parseInt(e.target.value) || 0)}
                            className={`w-full p-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600" : ""}`}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Max</Label>
                          <input
                            type="number"
                            value={selectedWidget.max || 100}
                            onChange={(e) => updateWidgetProperty('max', parseInt(e.target.value) || 100)}
                            className={`w-full p-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600" : ""}`}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {selectedWidget.type === 'arc' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Start Angle</Label>
                        <input
                          type="number"
                          value={selectedWidget.startAngle || 0}
                          onChange={(e) => updateWidgetProperty('startAngle', parseInt(e.target.value) || 0)}
                          className={`w-full p-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600" : ""}`}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">End Angle</Label>
                        <input
                          type="number"
                          value={selectedWidget.endAngle || 270}
                          onChange={(e) => updateWidgetProperty('endAngle', parseInt(e.target.value) || 270)}
                          className={`w-full p-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600" : ""}`}
                        />
                      </div>
                    </div>
                  )}

                  {selectedWidget.type === 'checkbox' && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedWidget.checked || false}
                        onChange={(e) => updateWidgetProperty('checked', e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label>Checked</Label>
                    </div>
                  )}

                  {selectedWidget.type === 'roller' && (
                    <div>
                      <Label>Options (one per line)</Label>
                      <textarea
                        value={selectedWidget.options || ''}
                        onChange={(e) => updateWidgetProperty('options', e.target.value)}
                        rows={4}
                        className={`w-full p-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600" : ""}`}
                      />
                    </div>
                  )}

                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={deleteWidget}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Widget
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className={`p-4 border-b ${headerClass}`}>
            <h2 className="text-lg font-semibold">Design Canvas (320x240)</h2>
          </div>
          <div className={`flex-1 overflow-auto ${canvasAreaClass} p-4`}>
            <div 
              ref={canvasRef}
              className={`relative mx-auto shadow-lg ${canvasBgClass}`}
              style={{ 
                width: 320 * zoomLevel, 
                height: 240 * zoomLevel, 
                backgroundColor,
                transform: `scale(1)`,
                transformOrigin: 'top left'
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => setSelectedWidget(null)}
            >
              {widgets.map(widget => renderWidget(widget))}
              
              {widgets.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Drag widgets here to start designing
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Theme Toggle and GitHub Link */}
      <div className={`p-3 border-t ${headerClass}`}>
        <div className="container mx-auto flex justify-between items-center">
          <a 
            href="https://github.com/c0deirl" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm hover:underline"
          >
            C0deIRL Github
          </a>
          <Button 
            onClick={() => setDarkMode(!darkMode)}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${cardClass} border rounded-lg shadow-xl w-full max-w-md`}>
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">Welcome</h3>
              <button 
                onClick={() => setShowWelcomeModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="mb-4">
                This tool is designed for use with an ESP32-2432S028R "Cheap Yellow Display", and Home Assistant. 
                While it might work for other boards and display sizes, it is not recommended.
              </p>
              <Button 
                onClick={() => setShowWelcomeModal(false)}
                className="w-full"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* YAML Modal */}
      {showYamlModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${cardClass} border rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col`}>
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">ESPHome YAML Configuration</h3>
              <button 
                onClick={() => setShowYamlModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <textarea 
                value={yamlOutput} 
                readOnly 
                className={`font-mono text-sm min-h-[400px] w-full p-2 rounded border ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}
              />
            </div>
            <div className="border-t p-4 flex justify-end">
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(yamlOutput);
                  setShowYamlModal(false);
                }}
              >
                Copy to Clipboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}