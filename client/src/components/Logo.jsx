import React from 'react';

const Logo = () => {
    return (
        <div className="flex items-center gap-2.5 select-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 text-orange-600 relative -top-[1px]">
                <path d="M12.75 4.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM9.75 4.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM15.75 4.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" />
                <path fillRule="evenodd" d="M2.25 9.75A2.25 2.25 0 014.5 7.5h11.25A2.25 2.25 0 0118 9.75v2.25c0 4.28-3.012 7.876-7.062 8.826a2.25 2.25 0 01-2.438-2.438v-1.638H6.75v1.638c0 .836-.446 1.61-1.169 2.03a9.75 9.75 0 01-3.331-8.668zM19.5 9.75a.75.75 0 01.75.75v2.25a6.75 6.75 0 01-1.08 3.497.75.75 0 01-1.215-.884 5.25 5.25 0 00.795-2.613V10.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            <span className="text-2xl font-bold text-orange-600 tracking-tighter leading-none">CafeConnect</span>
        </div>
    );
};

export default Logo;
