"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Edit, Trash2, Palette, X, Type, ToggleLeft, Volume2, Image, RotateCw } from "lucide-react";

// Define widget types
type WidgetType = 'label' | 'button' | 'slider' | 'checkbox' | 'image' | 'arc' | 'bar' | 'switch' | 'roller' | 'dropdown';

interface Widget {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  value?: number;
  checked?: boolean;
  src?: string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  checkedBgColor?: string;
  options?: string[];
  selectedOption?: number;
  min?: number;
  max?: number;
  angle?: number;
}

const LVGLWidgetDesigner: React.FC = () => {
  // State for widgets and canvas
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [draggingWidget, setDraggingWidget] = useState<WidgetType | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [yamlOutput, setYamlOutput] = useState('');
  const [showYamlModal, setShowYamlModal] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Available widget types
  const widgetTypes: { type: WidgetType; name: string; icon: React.ReactNode }[] = [
    { type: 'label', name: 'Label', icon: <Type className="w-4 h-4" /> },
    { type: 'button', name: 'Button', icon: <div className="w-4 h-4 bg-green-500 rounded" /> },
    { type: 'slider', name: 'Slider', icon: <div className="w-4 h-4 bg-yellow-500 rounded-full" /> },
    { type: 'checkbox', name: 'Checkbox', icon: <div className="w-4 h-4 bg-purple-500 border-2 border-white" /> },
    { type: 'switch', name: 'Switch', icon: <ToggleLeft className="w-4 h-4" /> },
    { type: 'image', name: 'Image', icon: <Image className="w-4 h-4" /> },
    { type: 'arc', name: 'Arc', icon: <div className="w-4 h-4 rounded-full border-2 border-blue-500" /> },
    { type: 'bar', name: 'Bar', icon: <div className="w-4 h-4 bg-blue-500" /> },
    { type: 'roller', name: 'Roller', icon: <RotateCw className="w-4 h-4" /> },
    { type: 'dropdown', name: 'Dropdown', icon: <div className="w-4 h-4 bg-gray-300 border border-gray-500" /> },
  ];

  // Default colors for widget types
  const getDefaultColors = (type: WidgetType) => {
    switch (type) {
      case 'label': return { bgColor: '#ffffff', textColor: '#000000', borderColor: '#cccccc' };
      case 'button': return { bgColor: '#3b82f6', textColor: '#ffffff', borderColor: '#2563eb', checkedBgColor: '#1d4ed8' };
      case 'slider': return { bgColor: '#e5e7eb', textColor: '#3b82f6', borderColor: '#d1d5db' };
      case 'checkbox': return { bgColor: '#ffffff', textColor: '#000000', borderColor: '#9ca3af', checkedBgColor: '#3b82f6' };
      case 'switch': return { bgColor: '#e5e7eb', textColor: '#3b82f6', borderColor: '#d1d5db', checkedBgColor: '#3b82f6' };
      case 'image': return { bgColor: '#f3f4f6', textColor: '#000000', borderColor: '#e5e7eb' };
      case 'arc': return { bgColor: '#ffffff', textColor: '#3b82f6', borderColor: '#d1d5db' };
      case 'bar': return { bgColor: '#e5e7eb', textColor: '#3b82f6', borderColor: '#d1d5db' };
      case 'roller': return { bgColor: '#ffffff', textColor: '#000000', borderColor: '#9ca3af' };
      case 'dropdown': return { bgColor: '#ffffff', textColor: '#000000', borderColor: '#9ca3af' };
      default: return { bgColor: '#ffffff', textColor: '#000000', borderColor: '#cccccc' };
    }
  };

  // Handle drag start from widget palette
  const handleDragStart = (e: React.DragEvent, type: WidgetType) => {
    e.dataTransfer.setData('widgetType', type);
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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create new widget with default colors
    const defaultColors = getDefaultColors(draggingWidget);
    const newWidget: Widget = {
      id: `widget_${Date.now()}`,
      type: draggingWidget,
      x: Math.max(0, x - 25),
      y: Math.max(0, y - 15),
      width: 50,
      height: 30,
      ...defaultColors,
      ...(draggingWidget === 'label' && { text: 'Label' }),
      ...(draggingWidget === 'button' && { text: 'Button' }),
      ...(draggingWidget === 'slider' && { value: 50, min: 0, max: 100 }),
      ...(draggingWidget === 'checkbox' && { checked: false }),
      ...(draggingWidget === 'switch' && { checked: false }),
      ...(draggingWidget === 'image' && { src: '' }),
      ...(draggingWidget === 'arc' && { value: 70, min: 0, max: 100, angle: 270 }),
      ...(draggingWidget === 'bar' && { value: 60, min: 0, max: 100 }),
      ...(draggingWidget === 'roller' && { options: ['Option 1', 'Option 2', 'Option 3'], selectedOption: 0 }),
      ...(draggingWidget === 'dropdown' && { options: ['Item 1', 'Item 2', 'Item 3'], selectedOption: 0 }),
    };

    // Set default sizes for specific widgets
    if (draggingWidget === 'slider') {
      newWidget.width = 120;
      newWidget.height = 20;
    } else if (draggingWidget === 'arc') {
      newWidget.width = 60;
      newWidget.height = 60;
    } else if (draggingWidget === 'bar') {
      newWidget.width = 100;
      newWidget.height = 20;
    } else if (draggingWidget === 'roller') {
      newWidget.width = 100;
      newWidget.height = 80;
    } else if (draggingWidget === 'dropdown') {
      newWidget.width = 100;
      newWidget.height = 30;
    }

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
  const handleWidgetDragStart = (e: React.DragEvent, widget: Widget) => {
    e.stopPropagation();
    setIsDragging(true);
    setSelectedWidget(widget);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Handle widget drag
  const handleWidgetDrag = (e: React.DragEvent) => {
    if (!isDragging || !selectedWidget || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;
    
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
    
    setWidgets(widgets.map(w => 
      w.id === selectedWidget.id 
        ? { ...w, [property]: value } 
        : w
    ));
    
    setSelectedWidget({ ...selectedWidget, [property]: value });
  };

  // Delete selected widget
  const deleteWidget = (widgetId?: string) => {
    const idToDelete = widgetId || selectedWidget?.id;
    if (!idToDelete) return;
    
    setWidgets(widgets.filter(w => w.id !== idToDelete));
    if (selectedWidget?.id === idToDelete) {
      setSelectedWidget(null);
    }
  };

  // Generate ESPHome YAML
  const generateYAML = () => {
    let yaml = `display:
  - platform: lvgl
    id: tft_display
    rotation: 0
    buffer_size: 32KB
    update_interval: 16ms
    color_depth: 16
    bg_color: 0x${backgroundColor.replace('#', '')}\n`;
    
    if (widgets.length > 0) {
      yaml += `\n`;
      
      widgets.forEach(widget => {
        yaml += `    - ${widget.type}:\n`;
        yaml += `        id: ${widget.id}\n`;
        yaml += `        x: ${widget.x}\n`;
        yaml += `        y: ${widget.y}\n`;
        yaml += `        width: ${widget.width}\n`;
        yaml += `        height: ${widget.height}\n`;
        
        if (widget.type === 'label' || widget.type === 'button') {
          yaml += `        text: "${widget.text || ''}"\n`;
        }
        
        if (widget.type === 'button' || widget.type === 'checkbox' || widget.type === 'switch') {
          yaml += `        checkable: ${widget.type === 'checkbox' || widget.type === 'switch' ? 'true' : 'false'}\n`;
        }
        
        if (widget.type === 'slider' || widget.type === 'arc' || widget.type === 'bar') {
          yaml += `        value: ${widget.value || 0}\n`;
          if (widget.min !== undefined) yaml += `        min_value: ${widget.min}\n`;
          if (widget.max !== undefined) yaml += `        max_value: ${widget.max}\n`;
        }
        
        if (widget.type === 'arc' && widget.angle) {
          yaml += `        rotation: ${widget.angle}\n`;
        }
        
        if (widget.type === 'checkbox' || widget.type === 'switch') {
          yaml += `        checked: ${widget.checked ? 'true' : 'false'}\n`;
        }
        
        if (widget.type === 'roller' || widget.type === 'dropdown') {
          if (widget.options && widget.options.length > 0) {
            yaml += `        options: |\n`;
            widget.options.forEach(option => {
              yaml += `          ${option}\n`;
            });
          }
          if (widget.selectedOption !== undefined) {
            yaml += `        selected: ${widget.selectedOption}\n`;
          }
        }
        
        // Add color properties
        if (widget.bgColor) {
          yaml += `        bg_color: 0x${widget.bgColor.replace('#', '')}\n`;
        }
        
        if (widget.textColor) {
          yaml += `        text_color: 0x${widget.textColor.replace('#', '')}\n`;
        }
        
        if (widget.borderColor) {
          yaml += `        border_color: 0x${widget.borderColor.replace('#', '')}\n`;
        }
        
        // Add checked state colors for checkable widgets
        if ((widget.type === 'button' || widget.type === 'checkbox' || widget.type === 'switch') && widget.checkedBgColor) {
          yaml += `        checked:\n`;
          yaml += `          bg_color: 0x${widget.checkedBgColor.replace('#', '')}\n`;
        }
        
        yaml += `\n`;
      });
    }
    
    setYamlOutput(yaml);
    setShowYamlModal(true);
  };

  // Render widget based on type
  const renderWidget = (widget: Widget) => {
    const isSelected = selectedWidget?.id === widget.id;
    const baseClasses = `absolute cursor-move border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'}`;
    
    // Delete button for selected widgets
    const deleteButton = isSelected ? (
      <button
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 z-20"
        onClick={(e) => {
          e.stopPropagation();
          deleteWidget(widget.id);
        }}
      >
        <X className="h-3 w-3" />
      </button>
    ) : null;
    
    switch (widget.type) {
      case 'label':
        return (
          <div
            className={`${baseClasses} flex items-center justify-center`}
            style={{ 
              left: widget.x, 
              top: widget.y, 
              width: widget.width, 
              height: widget.height,
              backgroundColor: widget.bgColor,
              color: widget.textColor,
              borderColor: widget.borderColor
            }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(e, widget)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            {widget.text}
            {deleteButton}
          </div>
        );
        
      case 'button':
        return (
          <div
            className={`${baseClasses} flex items-center justify-center rounded`}
            style={{ 
              left: widget.x, 
              top: widget.y, 
              width: widget.width, 
              height: widget.height,
              backgroundColor: widget.bgColor,
              color: widget.textColor,
              borderColor: widget.borderColor
            }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(e, widget)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            {widget.text}
            {deleteButton}
          </div>
        );
        
      case 'slider':
        // Calculate knob position (20px wide knob)
        const knobWidth = 20;
        const knobPosition = widget.value && widget.min !== undefined && widget.max !== undefined
          ? ((widget.value - widget.min) / (widget.max - widget.min)) * (widget.width - knobWidth) 
          : 0;
        
        return (
          <div
            className={`${baseClasses} rounded-full flex items-center`}
            style={{ 
              left: widget.x, 
              top: widget.y, 
              width: widget.width, 
              height: widget.height,
              backgroundColor: widget.bgColor,
              borderColor: widget.borderColor,
              padding: '2px'
            }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(e, widget)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            {/* Slider track */}
            <div className="relative w-full h-2 rounded-full" style={{ backgroundColor: widget.borderColor }}>
              {/* Filled portion */}
              <div 
                className="absolute top-0 left-0 h-full rounded-full" 
                style={{ 
                  width: `${widget.value && widget.min !== undefined && widget.max !== undefined 
                    ? ((widget.value - widget.min) / (widget.max - widget.min)) * 100 
                    : 0}%`,
                  backgroundColor: widget.textColor
                }}
              />
              
              {/* Slider knob */}
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 rounded-full border-2 shadow"
                style={{ 
                  left: `${knobPosition}px`,
                  width: `${knobWidth}px`,
                  height: `${knobWidth}px`,
                  backgroundColor: widget.textColor,
                  borderColor: widget.borderColor,
                  zIndex: 10
                }}
              />
            </div>
            {deleteButton}
          </div>
        );
        
      case 'checkbox':
        return (
          <div
            className={`${baseClasses} flex items-center justify-center border rounded`}
            style={{ 
              left: widget.x, 
              top: widget.y, 
              width: widget.width, 
              height: widget.height,
              backgroundColor: widget.bgColor,
              borderColor: widget.borderColor
            }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(e, widget)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            {widget.checked && <div className="w-3/4 h-3/4 rounded-sm" style={{ backgroundColor: widget.textColor }} />}
            {deleteButton}
          </div>
        );
        
      case 'switch':
        return (
          <div
            className={`${baseClasses} flex items-center rounded-full p-1`}
            style={{ 
              left: widget.x, 
              top: widget.y, 
              width: widget.width,
              height: widget.height,
              backgroundColor: widget.checked ? widget.checkedBgColor : widget.bgColor,
              borderColor: widget.borderColor,
              borderWidth: '1px'
            }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(e, widget)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            <div 
              className="h-4/5 rounded-full shadow transition-transform"
              style={{ 
                width: `${widget.height * 0.8}px`,
                backgroundColor: 'white',
                transform: `translateX(${widget.checked ? '100%' : '0%'})`,
                marginLeft: widget.checked ? 'auto' : '0'
              }}
            />
            {deleteButton}
          </div>
        );
        
      case 'image':
        return (
          <div
            className={`${baseClasses} flex items-center justify-center`}
            style={{ 
              left: widget.x, 
              top: widget.y, 
              width: widget.width, 
              height: widget.height,
              backgroundColor: widget.bgColor,
              borderColor: widget.borderColor
            }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(e, widget)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            <div className="border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
              IMG
            </div>
            {deleteButton}
          </div>
        );
        
      case 'arc':
        return (
          <div
            className={`${baseClasses} rounded-full flex items-center justify-center`}
            style={{ 
              left: widget.x, 
              top: widget.y, 
              width: widget.width, 
              height: widget.height,
              backgroundColor: widget.bgColor,
              borderColor: widget.borderColor
            }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(e, widget)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            <div className="relative w-full h-full rounded-full border-4 border-gray-300">
              <div 
                className="absolute top-0 left-0 w-full h-full rounded-full border-4"
                style={{ 
                  borderColor: widget.textColor,
                  clipPath: `inset(0 ${100 - (widget.value || 0)}% 0 0)`
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {widget.value}%
              </div>
            </div>
            {deleteButton}
          </div>
        );
        
      case 'bar':
        return (
          <div
            className={`${baseClasses} rounded flex items-center`}
            style={{ 
              left: widget.x, 
              top: widget.y, 
              width: widget.width, 
              height: widget.height,
              backgroundColor: widget.bgColor,
              borderColor: widget.borderColor,
              borderWidth: '1px'
            }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(e, widget)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            <div 
              className="h-full rounded"
              style={{ 
                width: `${widget.value || 0}%`,
                backgroundColor: widget.textColor
              }}
            />
            {deleteButton}
          </div>
        );
        
      case 'roller':
        return (
          <div
            className={`${baseClasses} rounded flex flex-col overflow-hidden`}
            style={{ 
              left: widget.x, 
              top: widget.y, 
              width: widget.width, 
              height: widget.height,
              backgroundColor: widget.bgColor,
              borderColor: widget.borderColor,
              borderWidth: '1px'
            }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(e, widget)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            <div className="flex-1 flex items-center justify-center border-b">
              {widget.options?.[widget.selectedOption || 0] || 'Option'}
            </div>
            <div className="flex">
              <div className="flex-1 bg-gray-200 text-center py-1 text-xs">▲</div>
              <div className="flex-1 bg-gray-200 text-center py-1 text-xs">▼</div>
            </div>
            {deleteButton}
          </div>
        );
        
      case 'dropdown':
        return (
          <div
            className={`${baseClasses} rounded flex items-center justify-between px-2`}
            style={{ 
              left: widget.x, 
              top: widget.y, 
              width: widget.width, 
              height: widget.height,
              backgroundColor: widget.bgColor,
              borderColor: widget.borderColor,
              borderWidth: '1px'
            }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(e, widget)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            <div>
              {widget.options?.[widget.selectedOption || 0] || 'Select'}
            </div>
            <div>▼</div>
            {deleteButton}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">LVGL Widget Designer</h1>
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
        <div className="w-64 bg-white border-r p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Widgets</h2>
          <div className="space-y-2">
            {widgetTypes.map((widget) => (
              <div
                key={widget.type}
                draggable
                onDragStart={(e) => handleDragStart(e, widget.type)}
                className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg cursor-move hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded">
                  {widget.icon}
                </div>
                <span>{widget.name}</span>
              </div>
            ))}
          </div>

          {/* Background Color */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Background</h2>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded border border-gray-300" 
                    style={{ backgroundColor: backgroundColor }}
                  />
                  <Input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Properties Panel */}
          {selectedWidget && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Properties</h2>
              <Card>
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <Label>Position</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">X</Label>
                        <Input
                          type="number"
                          value={selectedWidget.x}
                          onChange={(e) => updateWidgetProperty('x', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Y</Label>
                        <Input
                          type="number"
                          value={selectedWidget.y}
                          onChange={(e) => updateWidgetProperty('y', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Size</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Width</Label>
                        <Input
                          type="number"
                          value={selectedWidget.width}
                          onChange={(e) => updateWidgetProperty('width', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Height</Label>
                        <Input
                          type="number"
                          value={selectedWidget.height}
                          onChange={(e) => updateWidgetProperty('height', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>

                  {(selectedWidget.type === 'label' || selectedWidget.type === 'button') && (
                    <div>
                      <Label>Text</Label>
                      <Input
                        value={selectedWidget.text || ''}
                        onChange={(e) => updateWidgetProperty('text', e.target.value)}
                      />
                    </div>
                  )}

                  {(selectedWidget.type === 'slider' || selectedWidget.type === 'arc' || selectedWidget.type === 'bar') && (
                    <div>
                      <Label>Value</Label>
                      <Input
                        type="number"
                        min={selectedWidget.min || 0}
                        max={selectedWidget.max || 100}
                        value={selectedWidget.value || 0}
                        onChange={(e) => updateWidgetProperty('value', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  )}

                  {(selectedWidget.type === 'slider' || selectedWidget.type === 'arc' || selectedWidget.type === 'bar') && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Min Value</Label>
                        <Input
                          type="number"
                          value={selectedWidget.min || 0}
                          onChange={(e) => updateWidgetProperty('min', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Max Value</Label>
                        <Input
                          type="number"
                          value={selectedWidget.max || 100}
                          onChange={(e) => updateWidgetProperty('max', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  )}

                  {selectedWidget.type === 'arc' && (
                    <div>
                      <Label>Rotation Angle</Label>
                      <Input
                        type="number"
                        value={selectedWidget.angle || 270}
                        onChange={(e) => updateWidgetProperty('angle', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  )}

                  {(selectedWidget.type === 'checkbox' || selectedWidget.type === 'switch') && (
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

                  {(selectedWidget.type === 'roller' || selectedWidget.type === 'dropdown') && (
                    <div>
                      <Label>Options (one per line)</Label>
                      <Textarea
                        value={selectedWidget.options?.join('\n') || ''}
                        onChange={(e) => updateWidgetProperty('options', e.target.value.split('\n'))}
                        rows={3}
                      />
                      <Label className="text-xs mt-2 block">Selected Index</Label>
                      <Input
                        type="number"
                        min="0"
                        value={selectedWidget.selectedOption || 0}
                        onChange={(e) => updateWidgetProperty('selectedOption', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  )}

                  {/* Color Customization */}
                  <div className="space-y-3">
                    <h3 className="font-medium flex items-center">
                      <Palette className="mr-2 h-4 w-4" />
                      Colors
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Background</Label>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded border border-gray-300" 
                            style={{ backgroundColor: selectedWidget.bgColor }}
                          />
                          <Input
                            type="color"
                            value={selectedWidget.bgColor}
                            onChange={(e) => updateWidgetProperty('bgColor', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs">Text/Indicator</Label>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded border border-gray-300" 
                            style={{ backgroundColor: selectedWidget.textColor }}
                          />
                          <Input
                            type="color"
                            value={selectedWidget.textColor}
                            onChange={(e) => updateWidgetProperty('textColor', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Border</Label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border border-gray-300" 
                          style={{ backgroundColor: selectedWidget.borderColor }}
                        />
                        <Input
                          type="color"
                          value={selectedWidget.borderColor}
                          onChange={(e) => updateWidgetProperty('borderColor', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    {(selectedWidget.type === 'button' || selectedWidget.type === 'checkbox' || selectedWidget.type === 'switch') && (
                      <div>
                        <Label className="text-xs">Checked Background</Label>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded border border-gray-300" 
                            style={{ backgroundColor: selectedWidget.checkedBgColor }}
                          />
                          <Input
                            type="color"
                            value={selectedWidget.checkedBgColor}
                            onChange={(e) => updateWidgetProperty('checkedBgColor', e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => deleteWidget()}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Widget
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-white">
            <h2 className="text-lg font-semibold">Design Canvas (320x240)</h2>
          </div>
          <div className="flex-1 overflow-auto bg-gray-100 p-4">
            <div 
              ref={canvasRef}
              className="relative border border-gray-300 mx-auto"
              style={{ 
                width: 320, 
                height: 240,
                backgroundColor: backgroundColor
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

      {/* YAML Output Modal */}
      {showYamlModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">ESPHome YAML Configuration</h3>
              <button 
                onClick={() => setShowYamlModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <Textarea 
                value={yamlOutput} 
                readOnly 
                className="font-mono text-sm min-h-[400px]"
              />
            </div>
            <div className="p-4 border-t flex justify-end">
              <Button 
                onClick={() => navigator.clipboard.writeText(yamlOutput)}
                className="mr-2"
              >
                Copy to Clipboard
              </Button>
              <Button 
                onClick={() => setShowYamlModal(false)}
                variant="secondary"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LVGLWidgetDesigner;
