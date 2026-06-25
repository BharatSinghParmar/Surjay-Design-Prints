import {
  BadgeCheck,
  Droplets,
  Hand,
  Layers,
  MoveHorizontal,
  PackageCheck,
  PackageSearch,
  Paintbrush,
  PanelsTopLeft,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Timer,
  Truck,
  Waves,
  Wind
} from "lucide-react";

const icons = {
  BadgeCheck,
  Droplets,
  Hand,
  Layers,
  MoveHorizontal,
  PackageCheck,
  PackageSearch,
  Paintbrush,
  PanelsTopLeft,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Timer,
  Truck,
  Waves,
  Wind
};

export type IconName = keyof typeof icons;

export function ProcessIcon({ name }: { name: string }) {
  const Icon = icons[name as IconName] ?? BadgeCheck;
  return <Icon className="h-5 w-5" />;
}
