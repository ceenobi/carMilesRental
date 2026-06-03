interface props {
    title: string;
    description: string;
    image: string;
}

export default function NotFound({ title, description, image }: props) {
    return (
        <div className="flex flex-col items-center justify-center min-h-100">
            <img src={image} alt="not found" className="w-56 h-56" />
            <h2 className="text-xl font-semibold mt-4">{title}</h2>
            <p className="text-sm mt-2">{description}</p>
        </div>
    )
}