import React, { useState, useEffect } from 'react';
import { Category, NavigationPathItem, Product, Subcategory } from '../types.ts';
import { useAppContext } from '../hooks/useAppContext.tsx';
import { api } from '../services/api.ts';
import { Icons } from './Icons.tsx';
import { SideMenu } from './SideMenu.tsx';
import { CheckoutModal } from './CheckoutModal.tsx';

const Header: React.FC<{
    onMenuClick: () => void;
    searchQuery: string;
    onSearchChange: (q: string) => void;
}> = ({ onMenuClick, searchQuery, onSearchChange }) => {
    return (
        <header className="bg-header-light dark:bg-header-dark sticky top-0 z-30 p-3 shadow-md border-b border-gray-700">
            <div className="flex items-center gap-2">
                <button onClick={onMenuClick} className="w-11 h-11 flex-shrink-0">
                    <Icons.Menu />
                </button>
                <div className="relative flex-grow">
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tg-hint" />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar productos..."
                        className="w-full bg-searchInput-light dark:bg-searchInput-dark text-white/90 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-base"
                    />
                </div>
            </div>
        </header>
    );
};

const Breadcrumbs: React.FC<{
    path: NavigationPathItem[];
    onNavigate: (index: number) => void;
}> = ({ path, onNavigate }) => {
    if (path.length === 0) return null;
    return (
        <div className="px-3 pt-3 overflow-x-auto">
            <div className="flex items-center gap-2 pb-2 whitespace-nowrap">
                 <button onClick={() => onNavigate(-1)} className="flex items-center gap-2 bg-transparent border border-gray-600 text-gray-300 px-3 py-1.5 rounded-full text-sm">
                    <Icons.Home className="text-base" /> Inicio
                </button>
                {path.map((item, index) => (
                    <button key={item.id} onClick={() => onNavigate(index)} className={`flex items-center gap-2 border px-3 py-1.5 rounded-full text-sm ${index === path.length - 1 ? 'bg-tg-button text-tg-button-text border-tg-button font-bold' : 'bg-transparent border-gray-600 text-gray-300'}`}>
                       <Icons.Category name={item.name} className="text-base" /> {item.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

const CategoryGrid: React.FC<{ items: (Category[] | Subcategory[]); onSelect: (item: Category | Subcategory) => void; }> = ({ items, onSelect }) => (
    <div className="grid grid-cols-2 gap-4 p-4">
        {items.map(item => (
            <div key={item.id} onClick={() => onSelect(item)} className="bg-tg-bg rounded-lg p-2.5 flex flex-col items-center gap-2 cursor-pointer shadow">
                <div className="w-full aspect-square bg-tg-secondary-bg rounded-md flex items-center justify-center overflow-hidden">
                    {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" /> : <Icons.Category name={item.name} className="text-5xl text-tg-hint" />}
                </div>
                <span className="font-medium text-center text-sm">{item.name}</span>
            </div>
        ))}
    </div>
);

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const { cart, updateQuantity } = useAppContext();
    const [isActive, setIsActive] = useState(false);
    const quantity = cart[product.product_id]?.quantity || 0;

    useEffect(() => {
        if (quantity > 0) {
            setIsActive(true);
            const timer = setTimeout(() => setIsActive(false), 2000);
            return () => clearTimeout(timer);
        } else {
            setIsActive(false);
        }
    }, [quantity]);

    const handleInteraction = () => {
        if (quantity > 0 && !isActive) {
            setIsActive(true);
        }
    };
    
    const changeQty = (delta: number) => {
        const newQty = quantity + delta;
        updateQuantity(product.product_id, newQty > product.stock ? product.stock : newQty, product);
    };

    const showControls = isActive || quantity > 0;

    return (
        <div className="bg-tg-bg rounded-xl p-2.5 flex items-center gap-3 relative shadow">
            <div className="w-24 h-24 flex-shrink-0 bg-tg-secondary-bg rounded-lg bg-cover bg-center" style={{backgroundImage: `url(${product.image_url})`}}></div>
            <div className="flex-grow self-stretch flex flex-col justify-between">
                <div>
                    <div className="font-semibold text-base leading-tight text-tg-text">{product.product_name}</div>
                    <div className="text-sm text-tg-hint">{product.unit}</div>
                </div>
                <div className="text-base font-bold text-tg-text">${product.price.toFixed(2)}</div>
            </div>
            <div className="absolute bottom-2.5 right-2.5 h-9">
                {quantity === 0 ? (
                    <button onClick={() => changeQty(1)} className="w-9 h-9 flex items-center justify-center bg-tg-button text-tg-button-text rounded-full text-2xl font-bold shadow-lg">+</button>
                ) : (
                    <div onClick={handleInteraction} className={`transition-all duration-300 ease-in-out`}>
                        {showControls ? (
                           <div className="flex items-center gap-2 bg-tg-button text-tg-button-text rounded-full p-1 shadow-lg">
                               <button onClick={() => changeQty(-1)} className="w-7 h-7 flex items-center justify-center text-xl font-bold">-</button>
                               <span className="font-bold text-base min-w-[20px] text-center">{quantity}</span>
                               <button onClick={() => changeQty(1)} className="w-7 h-7 flex items-center justify-center text-xl font-bold">+</button>
                           </div>
                        ) : (
                           <div className="w-9 h-9 flex items-center justify-center bg-tg-button text-tg-button-text rounded-full font-bold shadow-lg">
                               {quantity}
                           </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const ProductList: React.FC<{ products: Product[]; }> = ({ products }) => (
    <div className="flex flex-col gap-3 p-4">
        {products.map(p => <ProductCard key={p.product_id} product={p} />)}
    </div>
);


export const CatalogView: React.FC = () => {
    const { cartCount, cartSubtotal } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    const [catalog, setCatalog] = useState<Category[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [navigationPath, setNavigationPath] = useState<NavigationPathItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    useEffect(() => {
        api.fetchCatalog().then(data => {
            setCatalog(data);
            setAllProducts(data.flatMap(c => c.subcategories.flatMap(s => s.products)));
            setIsLoading(false);
        });
    }, []);

    const handleNavigation = (index: number) => {
        setNavigationPath(prev => prev.slice(0, index + 1));
    };

    const handleSelect = (item: Category | Subcategory) => {
        setNavigationPath(prev => [...prev, { id: item.id, name: item.name }]);
    };

    const renderContent = () => {
        if (isLoading) return <div className="p-4 text-center text-tg-hint">Cargando productos...</div>;
        
        if (searchQuery) {
            const results = allProducts.filter(p => p.product_name.toLowerCase().includes(searchQuery.toLowerCase()));
            return <ProductList products={results} />;
        }

        const level = navigationPath.length;
        if (level === 0) return <CategoryGrid items={catalog} onSelect={handleSelect} />;
        
        const cat = catalog.find(c => c.id === navigationPath[0].id);
        if (level === 1) return cat ? <CategoryGrid items={cat.subcategories} onSelect={handleSelect} /> : null;
        
        const sub = cat?.subcategories.find(s => s.id === navigationPath[1].id);
        if (level === 2) return sub ? <ProductList products={sub.products} /> : null;

        return null;
    };

    return (
        <div className="flex flex-col h-screen">
            <Header onMenuClick={() => setIsMenuOpen(true)} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            
            {!searchQuery && <Breadcrumbs path={navigationPath} onNavigate={handleNavigation} />}

            <main className="flex-grow overflow-y-auto bg-tg-secondary-bg">
                {renderContent()}
            </main>
            
            {cartCount > 0 && (
                 <div 
                    onClick={() => setIsCheckoutOpen(true)}
                    className="fixed bottom-5 right-5 bg-tg-button text-tg-button-text rounded-full font-bold cursor-pointer shadow-2xl z-20 flex items-center gap-3 px-4 py-2"
                >
                    <div className="flex items-center gap-2">
                        <span className="bg-danger text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center">{cartCount}</span>
                        <Icons.Cart className="w-6 h-6"/>
                        <span>Ver Carrito</span>
                    </div>
                    <div className="font-semibold">${cartSubtotal.toFixed(2)}</div>
                </div>
            )}

            {isCheckoutOpen && <CheckoutModal onClose={() => setIsCheckoutOpen(false)} />}
        </div>
    );
};