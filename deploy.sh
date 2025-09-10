#!/bin/bash

# Step 1: Install Node.js and npm (if not already installed)
echo "Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Step 2: Create project directory
echo "Creating project directory..."
mkdir -p ~/lvgl-widget-designer
cd ~/lvgl-widget-designer

# Step 3: Initialize a new React project with TypeScript
echo "Initializing React project..."
npm create vite@latest . -- --template react-ts
npm install

# Step 4: Install required dependencies
echo "Installing dependencies..."
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Step 5: Configure Tailwind CSS
echo "Configuring Tailwind CSS..."
cat > tailwind.config.js << EOF
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# Step 6: Configure Tailwind in CSS
cat > src/index.css << EOF
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# Step 7: Create the components directory structure
mkdir -p src/components/ui

# Step 8: Create shadcn UI components manually
# Button component
cat > src/components/ui/button.tsx << 'EOF'
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
EOF

# Card component
cat > src/components/ui/card.tsx << 'EOF'
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
EOF

# Input component
cat > src/components/ui/input.tsx << 'EOF'
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
EOF

# Label component
cat > src/components/ui/label.tsx << 'EOF'
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
EOF

# Textarea component
cat > src/components/ui/textarea.tsx << 'EOF'
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
EOF

# Select component
cat > src/components/ui/select.tsx << 'EOF'
import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
EOF

# Dialog component
cat > src/components/ui/dialog.tsx << 'EOF'
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
EOF

# Create utils file
mkdir -p src/lib
cat > src/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

# Install additional dependencies for shadcn UI
npm install @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-select @radix-ui/react-dialog class-variance-authority clsx tailwind-merge

# Step 9: Create the main App component
cat > src/App.tsx << 'EOF'
import React from 'react';
import LVGLWidgetDesigner from './LVGLWidgetDesigner';
import './App.css';

function App() {
  return (
    <div className="App">
      <LVGLWidgetDesigner />
    </div>
  );
}

export default App;
EOF

# Step 10: Create the LVGL Widget Designer component
cat > src/LVGLWidgetDesigner.tsx << 'EOF'
"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Download, Edit, Trash2 } from "lucide-react";

// Define widget types
type WidgetType = 'label' | 'button' | 'slider' | 'checkbox' | 'image';

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
}

const LVGLWidgetDesigner: React.FC = () => {
  // State for widgets and canvas
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [draggingWidget, setDraggingWidget] = useState<WidgetType | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [yamlOutput, setYamlOutput] = useState('');
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Available widget types
  const widgetTypes: { type: WidgetType; name: string; icon: React.ReactNode }[] = [
    { type: 'label', name: 'Label', icon: <div className="w-4 h-4 bg-blue-500 rounded-sm" /> },
    { type: 'button', name: 'Button', icon: <div className="w-4 h-4 bg-green-500 rounded" /> },
    { type: 'slider', name: 'Slider', icon: <div className="w-4 h-4 bg-yellow-500 rounded-full" /> },
    { type: 'checkbox', name: 'Checkbox', icon: <div className="w-4 h-4 bg-purple-500 border-2 border-white" /> },
    { type: 'image', name: 'Image', icon: <div className="w-4 h-4 bg-pink-500" /> },
  ];

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

    // Create new widget
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: draggingWidget,
      x: Math.max(0, x - 25),
      y: Math.max(0, y - 15),
      width: draggingWidget === 'slider' ? 100 : 50,
      height: 30,
      ...(draggingWidget === 'label' && { text: 'Label' }),
      ...(draggingWidget === 'button' && { text: 'Button' }),
      ...(draggingWidget === 'slider' && { value: 50 }),
      ...(draggingWidget === 'checkbox' && { checked: false }),
      ...(draggingWidget === 'image' && { src: '' }),
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
  const deleteWidget = () => {
    if (!selectedWidget) return;
    
    setWidgets(widgets.filter(w => w.id !== selectedWidget.id));
    setSelectedWidget(null);
  };

  // Generate ESPHome YAML
  const generateYAML = () => {
    let yaml = `display:\n  - platform: lvgl\n    id: tft_display\n    rotation: 0\n    buffer_size: 32KB\n    update_interval: 16ms\n    lambda: |-\n`;
    
    widgets.forEach(widget => {
      yaml += `      auto ${widget.id} = lv_${widget.type}_create(lv_scr_act());\n`;
      
      if (widget.type === 'label' || widget.type === 'button') {
        yaml += `      lv_label_set_text(${widget.id}, "${widget.text || ''}");\n`;
      }
      
      if (widget.type === 'slider') {
        yaml += `      lv_slider_set_value(${widget.id}, ${widget.value || 0}, LV_ANIM_OFF);\n`;
      }
      
      if (widget.type === 'checkbox') {
        yaml += `      lv_checkbox_set_checked(${widget.id}, ${widget.checked ? 'true' : 'false'});\n`;
      }
      
      yaml += `      lv_obj_set_pos(${widget.id}, ${widget.x}, ${widget.y});\n`;
      yaml += `      lv_obj_set_size(${widget.id}, ${widget.width}, ${widget.height});\n\n`;
    });
    
    setYamlOutput(yaml);
  };

  // Render widget based on type
  const renderWidget = (widget: Widget) => {
    const isSelected = selectedWidget?.id === widget.id;
    const baseClasses = `absolute cursor-move border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'}`;
    
    switch (widget.type) {
      case 'label':
        return (
          <div
            className={`${baseClasses} flex items-center justify-center bg-white text-black`}
            style={{ left: widget.x, top: widget.y, width: widget.width, height: widget.height }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(e, widget)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            {widget.text}
          </div>
        );
        
      case 'button':
        return (
          <div
            className={`${baseClasses} flex items-center justify-center bg-blue-500 text-white rounded`}
            style={{ left: widget.x, top: widget.y, width: widget.width, height: widget.height }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(e, widget)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            {widget.text}
          </div>
        );
        
      case 'slider':
        return (
          <div
            className={`${baseClasses} bg-gray-200 rounded-full`}
            style={{ left: widget.x, top: widget.y, width: widget.width, height: widget.height }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(e, widget)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${widget.value || 0}%` }}
            />
          </div>
        );
        
      case 'checkbox':
        return (
          <div
            className={`${baseClasses} flex items-center justify-center bg-white border rounded`}
            style={{ left: widget.x, top: widget.y, width: widget.width, height: widget.height }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(e, widget)}
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
            style={{ left: widget.x, top: widget.y, width: widget.width, height: widget.height }}
            draggable
            onDragStart={(e) => handleWidgetDragStart(e, widget)}
            onDrag={handleWidgetDrag}
            onDragEnd={handleWidgetDragEnd}
            onClick={(e) => handleWidgetClick(widget, e)}
          >
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
              IMG
            </div>
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
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={generateYAML}>
                  <Download className="mr-2 h-4 w-4" />
                  Generate YAML
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>ESPHome YAML Configuration</DialogTitle>
                </DialogHeader>
                <Textarea 
                  value={yamlOutput} 
                  readOnly 
                  className="font-mono text-sm min-h-[400px]"
                />
                <Button 
                  onClick={() => navigator.clipboard.writeText(yamlOutput)}
                  className="mt-2"
                >
                  Copy to Clipboard
                </Button>
              </DialogContent>
            </Dialog>
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

                  {selectedWidget.type === 'label' && (
                    <div>
                      <Label>Text</Label>
                      <Input
                        value={selectedWidget.text || ''}
                        onChange={(e) => updateWidgetProperty('text', e.target.value)}
                      />
                    </div>
                  )}

                  {selectedWidget.type === 'button' && (
                    <div>
                      <Label>Text</Label>
                      <Input
                        value={selectedWidget.text || ''}
                        onChange={(e) => updateWidgetProperty('text', e.target.value)}
                      />
                    </div>
                  )}

                  {selectedWidget.type === 'slider' && (
                    <div>
                      <Label>Value</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={selectedWidget.value || 0}
                        onChange={(e) => updateWidgetProperty('value', parseInt(e.target.value) || 0)}
                      />
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

                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={deleteWidget}
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
              className="relative bg-white border border-gray-300 mx-auto"
              style={{ width: 320, height: 240 }}
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
    </div>
  );
};

export default LVGLWidgetDesigner;
EOF

# Step 11: Update main.tsx to use the new component
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# Step 12: Create a simple HTML template
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LVGL Widget Designer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

echo "Setup complete! To run the application:"
echo "1. Navigate to the project directory: cd ~/lvgl-widget-designer"
echo "2. Install dependencies: npm install"
echo "3. Start the development server: npm run dev"
echo "4. Open your browser to http://localhost:5173"
