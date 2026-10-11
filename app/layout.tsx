import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata:Metadata={title:'ILÉ - Nigerian Kitchen & Table',description:'Nigerian favourites, thoughtfully prepared. Explore the menu, order a meal or request a table in Victoria Island, Lagos.',manifest:'/manifest.webmanifest',icons:{icon:'/favicon.svg',apple:'/app-icon.png'}};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#d92d20'};
export default function Layout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en-NG"><body>{children}</body></html>}
