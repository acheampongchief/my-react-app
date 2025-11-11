import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

// Modern tab with hamburger (3 short dashes) trigger.
// - Click the hamburger to open a side panel with navigation links
// - Backdrop click or Esc closes the panel
// - Uses CSS variables for accent color with sensible defaults so it complements the app

const Tab = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    return (
        <div className="tab-wrapper">
            {/* Hamburger trigger: 3 short dashes */}
            <button
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                onClick={() => setOpen((s) => !s)}
                className="tab-hamburger"
                style={{
                    // Use CSS variable --accent if defined in your app, else fallback to Indigo
                    background: 'var(--accent, #4f46e5)',
                    color: 'white',
                }}
            >
                <span className="dash" />
                <span className="dash" />
                <span className="dash" />
            </button>

            {/* Backdrop */}
            <div
                className={`tab-backdrop ${open ? 'tab-backdrop--visible' : ''}`}
                onClick={() => setOpen(false)}
                aria-hidden={!open}
            />

            {/* Side panel */}
            <aside className={`tab-panel ${open ? 'tab-panel--open' : ''}`} aria-hidden={!open}>
                <nav className="tab-navigation">
                    <ul>
                        <li>
                            <Link to="/" onClick={() => setOpen(false)}>
                                Welcome
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard" onClick={() => setOpen(false)}>
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/profile" onClick={() => setOpen(false)}>
                                Profile
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Keep the Outlet (page content) as before */}
            <div className="tab-content">
                <Outlet />
            </div>

            {/* Minimal styles scoped to this component. If you use Tailwind, you can replace these with utility classes. */}
            <style>{`
                .tab-wrapper { position: relative; }

                .tab-hamburger {
                    position: fixed;
                    top: 1rem;
                    left: 1rem;
                    z-index: 60;
                    display: inline-flex;
                    flex-direction: column;
                    gap: 4px;
                    padding: 8px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.12);
                }

                .tab-hamburger:focus { outline: 2px solid rgba(255,255,255,0.6); outline-offset: 2px; }

                .dash {
                    display: block;
                    width: 20px; /* short dash */
                    height: 2px;
                    background: currentColor;
                    border-radius: 2px;
                }

                .tab-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0);
                    visibility: hidden;
                    transition: background 200ms ease, visibility 200ms ease;
                    z-index: 50;
                }
                .tab-backdrop--visible {
                    background: rgba(0,0,0,0.35);
                    visibility: visible;
                }

                .tab-panel {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    width: 280px;
                    max-width: 80vw;
                    background: var(--panel-bg, #fff);
                    color: var(--panel-fg, #111827);
                    transform: translateX(-110%);
                    transition: transform 260ms cubic-bezier(.22,.9,.18,1);
                    z-index: 55;
                    box-shadow: 8px 0 30px rgba(2,6,23,0.12);
                    padding: 1.25rem 1rem;
                    display: flex;
                    flex-direction: column;
                }
                .tab-panel--open { transform: translateX(0); }

                .tab-navigation ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
                .tab-navigation a { text-decoration: none; color: inherit; padding: 0.5rem 0.25rem; border-radius: 6px; display: inline-block; }
                .tab-navigation a:hover { background: rgba(79,70,229,0.06); }

                /* Ensure content doesn't hide behind the hamburger */
                .tab-content { padding-top: 0; }

                @media (min-width: 768px) {
                    /* On larger screens, show a slightly less prominent hamburger and allow panel to be persistent if desired. For now we keep toggle behavior consistent. */
                    .tab-hamburger { top: 1.25rem; left: 1.25rem; }
                }
            `}</style>
        </div>
    );
};

export default Tab;