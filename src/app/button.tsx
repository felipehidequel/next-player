export default function Button({ children, func }: { children: React.ReactNode, func: () => void }) {
    return (
        <button
            onClick={func}
            className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-3xl"
        >
            {children}
        </button>
    )
}