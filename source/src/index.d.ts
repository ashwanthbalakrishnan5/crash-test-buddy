import type * as React from 'react';

/** Token names usable as colors: see tokens.json. */
export type ColorToken = string;
export type IconName =
  | 'test' | 'shield' | 'shield-off' | 'phone' | 'scan' | 'flame' | 'secret' | 'heartbreak' | 'heart' | 'house' | 'sad'
  | 'noentry' | 'check' | 'warn' | 'cross' | 'mic' | 'calendar' | 'flag' | 'box' | 'back' | 'next' | 'play' | 'star'
  | 'sparkle' | 'calm' | 'refresh' | 'menu' | 'close' | 'truck';
export type Status = 'safe' | 'careful' | 'unsafe';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';
export type ToyKind = 'bear' | 'robot' | 'dino' | 'bunny';

export interface MotionProviderProps extends React.HTMLAttributes<HTMLDivElement> { calm?: boolean; children?: React.ReactNode }
export declare function MotionProvider(props: MotionProviderProps): React.ReactElement;

export interface IconProps { name: IconName; size?: number; title?: string; className?: string; style?: React.CSSProperties }
export declare function Icon(props: IconProps): React.ReactElement;

export interface BuddyProps { pose?: 'wave' | 'shield' | 'cheer'; mood?: 'happy' | 'worried'; size?: number; track?: boolean; crop?: 'head'; title?: string; className?: string; style?: React.CSSProperties }
export declare function Buddy(props: BuddyProps): React.ReactElement;

export interface ToyFriendProps { kind?: ToyKind; size?: number; talking?: boolean; shielded?: boolean; title?: string; className?: string; style?: React.CSSProperties }
export declare function ToyFriend(props: ToyFriendProps): React.ReactElement;

export interface FamilyArtProps { family?: 'mom-kid' | 'dad-kid' | 'grandma-kid' | 'kid-puffs' | 'kid-braids' | 'kid-curly'; size?: number; title?: string; heart?: boolean; className?: string }
export declare function FamilyArt(props: FamilyArtProps): React.ReactElement;

export interface BurstProps { kind?: 'confetti' | 'sparkle' | 'hearts'; count?: number; spread?: number; delay?: number; colors?: ColorToken[]; className?: string }
export declare function Burst(props: BurstProps): React.ReactElement | null;

export interface StatusTagProps { status?: Status | 'testing' | 'waiting'; size?: 'md' | 'lg'; stamp?: boolean; children?: React.ReactNode; className?: string }
export declare function StatusTag(props: StatusTagProps): React.ReactElement;

export interface GradeStickerProps { grade?: Grade; size?: 'sm' | 'md' | 'lg' | number; word?: boolean; wordText?: string; stamp?: boolean; tilt?: number; delay?: number; className?: string }
export declare function GradeSticker(props: GradeStickerProps): React.ReactElement;

export interface BigButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'quiet'; size?: 'lg' | 'md'; icon?: IconName; iconRight?: IconName; pulse?: boolean }
export declare function BigButton(props: BigButtonProps): React.ReactElement;

export interface ShieldSwitchProps { on: boolean; onChange?: (next: boolean) => void; label?: string; className?: string }
export declare function ShieldSwitch(props: ShieldSwitchProps): React.ReactElement;

export interface MenuItem { id: string; label: string; icon: IconName }
export interface TopMenuProps { items: MenuItem[]; current?: string | null; onSelect?: (id: string) => void; calm?: boolean; onCalmChange?: (next: boolean) => void; brand?: string; className?: string }
export declare function TopMenu(props: TopMenuProps): React.ReactElement;

export interface SpeechBubbleProps { from?: 'child' | 'toy'; status?: Status; typing?: boolean; type?: boolean; onTyped?: () => void; avatar?: React.ReactNode; children?: React.ReactNode; className?: string }
export declare function SpeechBubble(props: SpeechBubbleProps): React.ReactElement;

export interface TestTileProps { icon: IconName; label: string; state?: Status | 'testing' | 'waiting'; round?: number; className?: string }
export declare function TestTile(props: TestTileProps): React.ReactElement;

export interface ProgressBarProps { value?: number; max?: number; label?: React.ReactNode; done?: boolean; className?: string }
export declare function ProgressBar(props: ProgressBarProps): React.ReactElement;

export interface BeforeAfterRow { label: string; grade: Grade; percent: number }
export interface BeforeAfterProps { rows?: BeforeAfterRow[]; className?: string }
export declare function BeforeAfter(props: BeforeAfterProps): React.ReactElement;

export interface FixCardProps { icon?: IconName; topic?: string; question: string; bad: string; good: string; delay?: number; className?: string }
export declare function FixCard(props: FixCardProps): React.ReactElement;

export interface ShipmentBoxProps { id: string; count: string; toy?: ToyKind; toyName?: string; status?: Status | 'testing' | 'fixing'; grade?: Grade | null; progress?: number; onAddShield?: () => void; delay?: number; className?: string }
export declare function ShipmentBox(props: ShipmentBoxProps): React.ReactElement;

export interface FactRowProps { icon: IconName; children?: React.ReactNode; answer?: string; good?: boolean; delay?: number; className?: string }
export declare function FactRow(props: FactRowProps): React.ReactElement;

export interface StepPictureProps { icon: IconName; label: string; n?: number; tone?: ColorToken; onClick?: () => void; delay?: number; className?: string }
export declare function StepPicture(props: StepPictureProps): React.ReactElement;

declare global {
  interface Window {
    CTB: {
      MotionProvider: typeof MotionProvider; Icon: typeof Icon; Buddy: typeof Buddy; ToyFriend: typeof ToyFriend; FamilyArt: typeof FamilyArt;
      Burst: typeof Burst; StatusTag: typeof StatusTag; GradeSticker: typeof GradeSticker; BigButton: typeof BigButton; ShieldSwitch: typeof ShieldSwitch;
      TopMenu: typeof TopMenu; SpeechBubble: typeof SpeechBubble; TestTile: typeof TestTile; ProgressBar: typeof ProgressBar; BeforeAfter: typeof BeforeAfter;
      FixCard: typeof FixCard; ShipmentBox: typeof ShipmentBox; FactRow: typeof FactRow; StepPicture: typeof StepPicture;
      useCalm(): boolean; useCountUp(target: number, opts?: { duration?: number; delay?: number; run?: boolean }): number;
      ICON_NAMES: IconName[]; TOY_NAMES: Record<ToyKind, string>;
    };
  }
}
