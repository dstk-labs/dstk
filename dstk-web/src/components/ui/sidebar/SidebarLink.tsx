export type SidebarLinkProps = {
    children: React.ReactNode;
    href: string;
    icon?: React.ReactElement;
};

export const SidebarLink = ({ children, href, icon }: SidebarLinkProps) => {
    return (
        <a
            className='flex items-center gap-2 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-700'
            href={href}
        >
            <div className='h-6 w-6 text-gray-700 md:h-5 md:w-5'>{icon}</div>
            <span className='text-sm font-medium hidden md:block'>{children}</span>
        </a>
    );
};
