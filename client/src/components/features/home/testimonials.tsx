import { Separator } from "@/components/ui/separator";
import type { TestimonialType } from "@/lib/constants";

export default function Testimonials({ item }: { item: TestimonialType }) {
  return (
    <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="p-5 space-y-4">
        <img src={item.img} alt="quote" />
        <p className="text-sm text-SoftBlack font-light">{item.text}</p>
        <Separator />
        <div className="flex gap-2 items-center">
          <img src={item.avatar} alt="avatar" />
          <div>
            <h1 className="text-sm text-MainBlack">{item.name}</h1>
            <p className="text-xs text-SoftBlack">{item.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
