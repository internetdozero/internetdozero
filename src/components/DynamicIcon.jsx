import React from 'react';
import {
  Radio,
  Terminal,
  Sparkles,
  Gamepad2,
  Boxes,
  BrainCircuit,
  ShieldCheck,
  Cpu,
  Palette,
  HelpCircle,
  Activity,
  Zap,
  Globe,
  Lock,
  Clock,
  Layers
} from 'lucide-react';

const iconMap = {
  Radio,
  Terminal,
  Sparkles,
  Gamepad2,
  Boxes,
  BrainCircuit,
  ShieldCheck,
  Cpu,
  Palette,
  HelpCircle,
  Activity,
  Zap,
  Globe,
  Lock,
  Clock,
  Layers
};

export function DynamicIcon({ name, className = "w-5 h-5", ...props }) {
  const IconComponent = iconMap[name] || HelpCircle;
  return <IconComponent className={className} {...props} />;
}
