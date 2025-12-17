import ImageIcon from "@/assets/svgs/image.svg";
import MixIcon from "@/assets/svgs/mix.svg";
import VideoIcon from "@/assets/svgs/video.svg";

export const TOOLBAR_ITEMS: Array<{
  id: string;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}> = [
  { id: "image", label: "이미지", Icon: ImageIcon },
  { id: "video", label: "유튜브", Icon: VideoIcon },
  { id: "mix", label: "믹스", Icon: MixIcon },
];
