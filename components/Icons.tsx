
import React from 'react';

type IconProps = {
  className?: string;
};

export const Icons = {
  Spinner: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ),
  Menu: (props: IconProps) => (
    <div className="flex flex-col justify-center items-center gap-1.5 w-full h-full" {...props}>
        <span className="block w-7 h-0.5 bg-tg-hint rounded-full"></span>
        <span className="block w-7 h-0.5 bg-tg-hint rounded-full"></span>
        <span className="block w-7 h-0.5 bg-tg-hint rounded-full"></span>
    </div>
  ),
  Close: (props: IconProps) => (
    <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props}><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
  ),
  Cart: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.838-5.513a1.875 1.875 0 00-1.097-2.278H5.987l-.001-.002A1.875 1.875 0 004.137 4.5H2.25" />
    </svg>
  ),
  Search: (props: IconProps) => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
   Home: (props: IconProps) => (<span {...props}>🏪</span>),
   Category: (props: IconProps & {name:string}) => {
       const categoryEmojis: Record<string, string> = {
            'bebidas': '🥤', 'frutas': '🍎', 'verduras': '🥦', 'snacks': '🥨', 'dulces': '🍬', 'galletitas': '🍪',
            'lácteos': '🧀', 'quesos': '🧀', 'fiambres': '🥓', 'almacén': '🥫', 'limpieza': '🧼', 'panaderia': '🥐',
            'panificado': '🍞', 'carnes': '🍖', 'pollo': '🍗', 'pescado': '🐟', 'higiene': '🧴', 'congelados': '🧊',
            'alcohol': '🍺', 'vinos': '🍷', 'cigarrillos': '🚬'
        };
        const lowerCaseName = props.name.toLowerCase();
        for (const key in categoryEmojis) { if (lowerCaseName.includes(key)) return <span {...props}>{categoryEmojis[key]}</span>; }
        return <span {...props}>📂</span>;
   },
   User: (props: IconProps) => (
    <svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16,14 18.27,15.61 18.91,16.89C17.5,18.83 14.93,20 12,20C9.07,20 6.5,18.83 5.09,16.89C5.73,15.61 8,14 12,14Z"></path></svg>
   ),
   Phone: (props: IconProps) => (
    <svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"></path></svg>
   ),
   Logout: (props: IconProps) => (
     <svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"></path></svg>
   ),
   Location: (props: IconProps) => (
    <svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12,2C8.14,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.86,2 12,2M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5Z" /></svg>
   ),
    Attachment: (props: IconProps) => (
        <svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z"></path></svg>
    ),
    Star: (props: IconProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
    )
};
