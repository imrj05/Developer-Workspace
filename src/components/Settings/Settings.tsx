import { useEffect, useRef, useState } from 'react'
import { ImagePlus, Trash2, X, RotateCcw } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { useSettingsStore } from '../../stores/settingsStore'
import { ToggleSwitch } from '../ui/ToggleSwitch'
import { processWallpaperFile } from '../../lib/wallpaperStorage'
import type { LayoutPreset, SettingsTab } from '../../lib/layoutPresets'

const BACKGROUNDS = [
    'https://images.unsplash.com/photo-1572270907014-c31da1c54124?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80',
    'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjI0MX0&auto=format&fit=crop&w=1991&q=80',
    'https://images.unsplash.com/photo-1499623838158-29acea518eaa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1494806812796-244fe51b774d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1484417894907-623942c8ee29?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1489861518096-4d12b732e831?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1520034475321-cbe63696469a?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1483401757487-2ced3fa77952?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1772289093080-831ca03c76e1?auto=format&fit=crop&w=2000&q=100',
    'https://images.unsplash.com/photo-1772289495959-fb264ed662e2?q=80&w=1632&auto=format&fit=crop&w=2000',
    'https://images.unsplash.com/photo-1776451591680-d8ceafca123e?q=80&w=1181&auto=format&fit=crop&w=2000',
    'https://images.unsplash.com/photo-1616303139769-84fedd1ca001?q=80&w=1177&auto=format&fit=crop&w=2000',
    'https://images.unsplash.com/photo-1777047023428-ac55ddb8ba62?q=80&w=1170&auto=format&fit=crop&w=2000',
    'https://images.unsplash.com/photo-1777216092678-ab3cac218f80?q=80&w=1299&auto=format&fit=crop&w=2000',
    'https://images.unsplash.com/photo-1777195680759-9c3c616a92e7?q=80&w=1170&auto=format&fit=crop&w=2000',
    'https://images.unsplash.com/photo-1775571921416-32fb36a200da?q=80&w=1170&auto=format&fit=crop&w=2000',
    'https://images.unsplash.com/photo-1458869612855-bb6009d50368?q=80&w=1170&auto=format&fit=crop&w=2000',
    'https://images.unsplash.com/photo-1581596326248-f55ac7852760?q=80&w=1171&auto=format&fit=crop&w=2000',
    'https://images.unsplash.com/photo-1588455471455-4b28e9ab3cd5?q=80&w=1231&auto=format&fit=crop&w=2000',
    'https://images.unsplash.com/photo-1755398105315-a124a12152da?q=80&w=1170&auto=format&fit=crop&w=2000',
    'https://images.unsplash.com/photo-1699417824045-5c9ffdc32740?q=80&w=1170&auto=format&fit=crop&w=2000',
    'https://images.unsplash.com/photo-1777086000918-b0f1582e222a?q=80&w=1228&auto=format&fit=crop&w=2000',
]

const TIMEZONES = [
    { value: 'local', label: 'Local' },
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'EST' },
    { value: 'America/Chicago', label: 'CST' },
    { value: 'America/Denver', label: 'MST' },
    { value: 'America/Los_Angeles', label: 'PST' },
    { value: 'Asia/Kolkata', label: 'IST' },
    { value: 'Europe/London', label: 'GMT' },
    { value: 'Europe/Paris', label: 'CET' },
    { value: 'Asia/Tokyo', label: 'JST' }
]

const LAYOUT_PRESETS: { id: LayoutPreset; label: string; description: string }[] = [
    { id: 'minimal', label: 'Minimal', description: 'Clock, search, and pinned apps only.' },
    { id: 'developer', label: 'Developer', description: 'Balanced layout with tasks, bookmarks, and docked utilities.' },
    { id: 'full', label: 'Full', description: 'Every widget enabled for maximum visibility.' }
]

const WIDGET_TOGGLES = [
    { key: 'showWeatherWidget', label: 'Weather Widget' },
    { key: 'showBookmarks', label: 'Bookmarks' },
    { key: 'showDevPanel', label: 'Dev Panel' },
    { key: 'showTerminalNotes', label: 'Terminal Notes' },
    { key: 'showQuickActions', label: 'Quick Actions' },
    { key: 'showPinnedApps', label: 'Pinned Apps' },
    { key: 'showTaskPlanner', label: 'Task Planner' },
    { key: 'showRecentActivity', label: 'Recent Activity' },
    { key: 'showSnippetShelf', label: 'Snippet Shelf' },
    { key: 'showDevShortcuts', label: 'Dev Shortcuts' }
] as const

const TABS: { id: SettingsTab; label: string }[] = [
    { id: 'appearance', label: 'Appearance' },
    { id: 'layout', label: 'Layout' },
    { id: 'integrations', label: 'Integrations' }
]

interface SettingsProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialTab?: SettingsTab
}

export function Settings({ open, onOpenChange, initialTab = 'appearance' }: SettingsProps) {
    const { settings, updateSettings, applyLayoutPreset, resetSettings } = useSettingsStore()
    const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab)
    const [showAllBackgrounds, setShowAllBackgrounds] = useState(false)
    const [wallpaperError, setWallpaperError] = useState<string | null>(null)
    const [wallpaperUploading, setWallpaperUploading] = useState(false)
    const wallpaperInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (open) {
            setActiveTab(initialTab)
        }
    }, [open, initialTab])

    const handleReset = async () => {
        await resetSettings()
        onOpenChange(false)
    }

    const handleCustomWallpaperUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        event.target.value = ''
        if (!file) return

        setWallpaperUploading(true)
        setWallpaperError(null)

        try {
            const dataUrl = await processWallpaperFile(file)
            await updateSettings({ customBackground: dataUrl })
        } catch (error) {
            setWallpaperError(error instanceof Error ? error.message : 'Could not upload wallpaper.')
        } finally {
            setWallpaperUploading(false)
        }
    }

    const visibleBackgrounds = showAllBackgrounds ? BACKGROUNDS : BACKGROUNDS.slice(0, 9)

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm animate-fade-in" />
                <Dialog.Content className="fixed top-0 right-0 h-full w-full max-w-[420px] z-[201] overflow-y-auto border-l border-[var(--border)] bg-[var(--surface-overlay)]/95 px-5 py-6 shadow-[var(--card-shadow)] backdrop-blur-2xl animate-slide-in-right">
                    <Dialog.Description className="sr-only">
                        Settings panel for customizing the new tab extension
                    </Dialog.Description>
                    <div>
                        <div className="mb-5 flex items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
                            <div>
                                <div className="section-heading mb-2">Preferences</div>
                                <Dialog.Title className="text-2xl font-display font-semibold">Settings</Dialog.Title>
                            </div>
                            <Dialog.Close aria-label="Close settings" className="icon-button h-10 w-10">
                                <X aria-hidden="true" className="h-4 w-4" />
                            </Dialog.Close>
                        </div>

                        <div className="mb-5 flex gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)]/50 p-1">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    data-active={activeTab === tab.id}
                                    className="chip-button flex-1 justify-center px-2 py-2 text-xs"
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-6">
                            {activeTab === 'appearance' && (
                                <>
                                    <section className="card-subtle space-y-4 p-4">
                                        <div className="setting-row">
                                            <div className="setting-copy">
                                                <div className="setting-label">Dark Mode</div>
                                                <p className="setting-hint">Switch between light and dark surfaces.</p>
                                            </div>
                                            <ToggleSwitch
                                                pressed={settings.darkMode}
                                                onPressedChange={(pressed) => updateSettings({ darkMode: pressed })}
                                                ariaLabel="Toggle dark mode"
                                            />
                                        </div>
                                    </section>

                                    <section className="card-subtle space-y-4 p-4">
                                        <div className="space-y-1">
                                            <h3 className="setting-label">Background</h3>
                                            <p className="section-copy">Choose a wallpaper that stays subtle behind the dashboard.</p>
                                        </div>
                                        <div className="space-y-2 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] p-3">
                                            <input
                                                ref={wallpaperInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(event) => void handleCustomWallpaperUpload(event)}
                                            />
                                            {settings.customBackground ? (
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => void updateSettings({ customBackground: settings.customBackground })}
                                                        aria-label="Use custom wallpaper"
                                                        className={`aspect-[4/3] w-24 shrink-0 rounded-[var(--radius-md)] border bg-cover bg-center ${settings.customBackground
                                                            ? 'border-[var(--accent)] shadow-[var(--glow)]'
                                                            : 'border-transparent'
                                                            }`}
                                                        style={{ backgroundImage: `url(${settings.customBackground})` }}
                                                    />
                                                    <div className="min-w-0 flex-1 space-y-2">
                                                        <p className="text-sm font-medium text-[var(--text-primary)]">Custom wallpaper</p>
                                                        <p className="text-xs text-[var(--text-label)]">Saved locally on this device only.</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => wallpaperInputRef.current?.click()}
                                                                disabled={wallpaperUploading}
                                                                className="btn-secondary px-3 py-1.5 text-xs"
                                                            >
                                                                Replace
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => void updateSettings({ customBackground: null })}
                                                                className="chip-button px-3 py-1.5 text-xs text-[var(--error)]"
                                                            >
                                                                <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => wallpaperInputRef.current?.click()}
                                                    disabled={wallpaperUploading}
                                                    className="btn-secondary flex w-full items-center justify-center gap-2"
                                                >
                                                    <ImagePlus aria-hidden="true" className="h-4 w-4" />
                                                    {wallpaperUploading ? 'Processing image…' : 'Upload custom wallpaper'}
                                                </button>
                                            )}
                                            <p className="text-xs text-[var(--text-label)]">
                                                JPG, PNG, or WebP up to 8 MB. Stored in local browser storage, not Chrome Sync.
                                            </p>
                                            {wallpaperError ? (
                                                <p className="text-xs text-[var(--error)]">{wallpaperError}</p>
                                            ) : null}
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {visibleBackgrounds.map((bg, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => updateSettings({ background: bg, customBackground: null })}
                                                    aria-label={`Select background ${i + 1}`}
                                                    className={`aspect-[4/3] w-full rounded-[var(--radius-md)] bg-cover bg-center border ${settings.background === bg && !settings.customBackground
                                                        ? 'border-[var(--accent)] shadow-[var(--glow)]'
                                                        : 'border-transparent'
                                                        }`}
                                                    style={{ backgroundImage: `url(${bg})` }}
                                                />
                                            ))}
                                        </div>
                                        {BACKGROUNDS.length > 9 && (
                                            <button
                                                type="button"
                                                onClick={() => setShowAllBackgrounds((value) => !value)}
                                                className="btn-secondary w-full"
                                            >
                                                {showAllBackgrounds ? 'Show fewer wallpapers' : `Browse all ${BACKGROUNDS.length} wallpapers`}
                                            </button>
                                        )}
                                        <div className="space-y-3 pt-1">
                                            <div>
                                                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                                    <span className="setting-label">Wallpaper Intensity</span>
                                                    <span className="text-[var(--text-label)]">{settings.backgroundIntensity}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="10"
                                                    max="100"
                                                    value={settings.backgroundIntensity}
                                                    onChange={(e) => updateSettings({ backgroundIntensity: Number(e.target.value) })}
                                                    className="w-full accent-[var(--accent)]"
                                                />
                                            </div>
                                            <div>
                                                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                                    <span className="setting-label">Wallpaper Blur</span>
                                                    <span className="text-[var(--text-label)]">{settings.backgroundBlur}px</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="10"
                                                    value={settings.backgroundBlur}
                                                    onChange={(e) => updateSettings({ backgroundBlur: Number(e.target.value) })}
                                                    className="w-full accent-[var(--accent)]"
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    <section className="card-subtle space-y-4 p-4">
                                        <div className="space-y-1">
                                            <h3 className="setting-label">Clock</h3>
                                        </div>
                                        <div className="setting-row">
                                            <div className="setting-copy">
                                                <div className="setting-label">24-Hour Format</div>
                                            </div>
                                            <ToggleSwitch
                                                pressed={settings.clockFormat === '24'}
                                                onPressedChange={(pressed) => updateSettings({ clockFormat: pressed ? '24' : '12' })}
                                                ariaLabel="Toggle 24-hour format"
                                            />
                                        </div>
                                        <div className="setting-row">
                                            <div className="setting-copy">
                                                <div className="setting-label">Show Seconds</div>
                                            </div>
                                            <ToggleSwitch
                                                pressed={settings.showSeconds}
                                                onPressedChange={(pressed) => updateSettings({ showSeconds: pressed })}
                                                ariaLabel="Toggle seconds"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="timezone" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Timezone</label>
                                            <select
                                                id="timezone"
                                                value={settings.timeZone}
                                                onChange={(e) => updateSettings({ timeZone: e.target.value })}
                                                className="input-field rounded-[var(--radius-lg)]"
                                            >
                                                {TIMEZONES.map(tz => (
                                                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </section>
                                </>
                            )}

                            {activeTab === 'layout' && (
                                <>
                                    <section className="card-subtle space-y-3 p-4">
                                        <div className="space-y-1">
                                            <h3 className="setting-label">Layout Presets</h3>
                                            <p className="section-copy">Start from a curated layout, then fine-tune individual widgets below.</p>
                                        </div>
                                        <div className="space-y-2">
                                            {LAYOUT_PRESETS.map((preset) => (
                                                <button
                                                    key={preset.id}
                                                    type="button"
                                                    onClick={() => void applyLayoutPreset(preset.id)}
                                                    data-active={settings.layoutPreset === preset.id}
                                                    className="card-subtle flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:border-[var(--accent)]/30"
                                                >
                                                    <span className="text-sm font-semibold text-[var(--text-primary)]">{preset.label}</span>
                                                    <span className="text-xs text-[var(--text-secondary)]">{preset.description}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="card-subtle space-y-4 p-4">
                                        <div className="setting-row">
                                            <div className="setting-copy">
                                                <div className="setting-label">Focus Mode</div>
                                                <p className="setting-hint">Hide secondary surfaces and leave the hero area clean.</p>
                                            </div>
                                            <ToggleSwitch
                                                pressed={settings.focusMode}
                                                onPressedChange={(pressed) => updateSettings({ focusMode: pressed })}
                                                ariaLabel="Toggle focus mode"
                                            />
                                        </div>
                                    </section>

                                    <section className="card-subtle space-y-4 p-4">
                                        <div className="space-y-1">
                                            <h3 className="setting-label">Widgets</h3>
                                            <p className="section-copy">Toggle individual sections. Dev Panel and Notes open from the bottom dock.</p>
                                        </div>
                                        {WIDGET_TOGGLES.map(({ key, label }) => (
                                            <div key={key} className="setting-row">
                                                <div className="setting-copy">
                                                    <div className="setting-label">{label}</div>
                                                </div>
                                                <ToggleSwitch
                                                    pressed={settings[key]}
                                                    onPressedChange={(pressed) => updateSettings({ [key]: pressed })}
                                                    ariaLabel={`Toggle ${label}`}
                                                />
                                            </div>
                                        ))}
                                    </section>
                                </>
                            )}

                            {activeTab === 'integrations' && (
                                <>
                                    <section className="card-subtle space-y-4 p-4">
                                        <div className="space-y-1">
                                            <h3 className="setting-label">Weather</h3>
                                        </div>
                                        <div>
                                            <label htmlFor="weather-api-key" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">OpenWeatherMap API Key</label>
                                            <input
                                                id="weather-api-key"
                                                name="weather-api-key"
                                                autoComplete="off"
                                                type="password"
                                                value={settings.weatherApiKey}
                                                onChange={(e) => updateSettings({ weatherApiKey: e.target.value })}
                                                placeholder="Enter API key…"
                                                className="input-field"
                                            />
                                        </div>
                                        <div className="setting-row">
                                            <div className="setting-copy">
                                                <div className="setting-label">Use Fahrenheit</div>
                                            </div>
                                            <ToggleSwitch
                                                pressed={settings.useFahrenheit}
                                                onPressedChange={(pressed) => updateSettings({ useFahrenheit: pressed })}
                                                ariaLabel="Toggle fahrenheit"
                                            />
                                        </div>
                                    </section>

                                    <section className="card-subtle space-y-4 p-4">
                                        <div className="space-y-1">
                                            <h3 className="setting-label">GitHub</h3>
                                        </div>
                                        <div>
                                            <label htmlFor="github-username" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">GitHub Username</label>
                                            <input
                                                id="github-username"
                                                name="github-username"
                                                autoComplete="off"
                                                type="text"
                                                value={settings.githubUsername}
                                                onChange={(e) => updateSettings({ githubUsername: e.target.value })}
                                                placeholder="your-username"
                                                className="input-field"
                                            />
                                        </div>
                                        <div className="setting-row">
                                            <div className="setting-copy">
                                                <div className="setting-label">Auto-Rotate Backgrounds</div>
                                            </div>
                                            <ToggleSwitch
                                                pressed={settings.autoRotateBackgrounds}
                                                onPressedChange={(pressed) => updateSettings({ autoRotateBackgrounds: pressed })}
                                                ariaLabel="Toggle auto-rotate"
                                            />
                                        </div>
                                    </section>
                                </>
                            )}

                            <section className="card-subtle p-4">
                                <button onClick={handleReset} className="btn-secondary w-full border-[var(--error)]/30 text-[var(--error)] hover:border-[var(--error)] hover:bg-[var(--error)]/8 hover:text-[var(--error)]">
                                    <RotateCcw aria-hidden="true" className="h-4 w-4" />
                                    Reset to Defaults
                                </button>
                            </section>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
