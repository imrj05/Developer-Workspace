import { X, RotateCcw } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { useSettingsStore } from '../../stores/settingsStore'
import { ToggleSwitch } from '../ui/ToggleSwitch'
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
interface SettingsProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}
export function Settings({ open, onOpenChange }: SettingsProps) {
    const { settings, updateSettings, resetSettings } = useSettingsStore()
    const handleReset = async () => {
        await resetSettings()
        onOpenChange(false)
    }
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm animate-fade-in" />
                <Dialog.Content className="fixed top-0 right-0 h-full w-full max-w-[420px] z-[201] overflow-y-auto border-l border-[var(--border)] bg-[var(--surface-overlay)]/95 px-5 py-6 shadow-[var(--card-shadow)] backdrop-blur-2xl animate-slide-in-right" aria-describedby="settings-description">
                    <div>
                        <div className="mb-6 flex items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
                            <div>
                                <div className="section-heading mb-2">Preferences</div>
                                <Dialog.Title className="text-2xl font-display font-semibold">Settings</Dialog.Title>
                            </div>
                            <Dialog.Description id="settings-description" className="sr-only">Settings panel for customizing the new tab extension</Dialog.Description>
                            <Dialog.Close aria-label="Close settings" className="icon-button h-10 w-10">
                                <X aria-hidden="true" className="h-4 w-4" />
                            </Dialog.Close>
                        </div>
                        <div className="space-y-6">
                            <section className="card-subtle space-y-4 p-4">
                                <div className="space-y-1">
                                    <h3 className="section-heading">Appearance</h3>
                                    <p className="section-copy">Control the overall mood and background treatment of your workspace.</p>
                                </div>
                                <div className="setting-row">
                                    <div className="setting-copy">
                                        <div className="setting-label">Dark Mode</div>
                                        <p className="setting-hint">Switch between light and dark surfaces instantly.</p>
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
                                    <h3 className="section-heading">Background</h3>
                                    <p className="section-copy">Choose a wallpaper that stays subtle behind the dashboard.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {BACKGROUNDS.map((bg, i) => (
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
                                <div className="space-y-3 pt-1">
                                    <div>
                                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                            <span className="setting-label">Wallpaper Intensity</span>
                                            <span className="text-[var(--text-label)]">{settings.backgroundIntensity}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="10"
                                            max="60"
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
                                    <h3 className="section-heading">Clock</h3>
                                    <p className="section-copy">Tune the main time display for the way you work.</p>
                                </div>
                                <div className="setting-row">
                                    <div className="setting-copy">
                                        <div className="setting-label">24-Hour Format</div>
                                        <p className="setting-hint">Use a military-style clock instead of AM/PM.</p>
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
                                        <p className="setting-hint">Display a live seconds counter in the clock.</p>
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
                            <section className="card-subtle space-y-4 p-4">
                                <div className="space-y-1">
                                    <h3 className="section-heading">Weather</h3>
                                    <p className="section-copy">Keep the small weather chip useful without making it noisy.</p>
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
                                        <p className="setting-hint">Switch units for temperature display.</p>
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
                                    <h3 className="section-heading">Developer</h3>
                                    <p className="section-copy">Configure developer-focused integrations and automation.</p>
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
                                        className="input-field"
                                    />
                                </div>
                                <div className="setting-row">
                                    <div className="setting-copy">
                                        <div className="setting-label">Auto-Rotate Backgrounds</div>
                                        <p className="setting-hint">Cycle through the bundled wallpapers automatically.</p>
                                    </div>
                                    <ToggleSwitch
                                        pressed={settings.autoRotateBackgrounds}
                                        onPressedChange={(pressed) => updateSettings({ autoRotateBackgrounds: pressed })}
                                        ariaLabel="Toggle auto-rotate"
                                    />
                                </div>
                            </section>
                            <section className="card-subtle space-y-4 p-4">
                                <div className="space-y-1">
                                    <h3 className="section-heading">Productivity</h3>
                                    <p className="section-copy">Shape how much guidance and structure shows up in the workspace.</p>
                                </div>
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
                                <div className="setting-row">
                                    <div className="setting-copy">
                                        <div className="setting-label">Quick Actions</div>
                                        <p className="setting-hint">Show the action row for command palette, focus mode, tasks, and settings.</p>
                                    </div>
                                    <ToggleSwitch
                                        pressed={settings.showQuickActions}
                                        onPressedChange={(pressed) => updateSettings({ showQuickActions: pressed })}
                                        ariaLabel="Toggle quick actions"
                                    />
                                </div>
                                <div className="setting-row">
                                    <div className="setting-copy">
                                        <div className="setting-label">Pinned Apps</div>
                                        <p className="setting-hint">Keep a small strip of daily apps under the hero area.</p>
                                    </div>
                                    <ToggleSwitch
                                        pressed={settings.showPinnedApps}
                                        onPressedChange={(pressed) => updateSettings({ showPinnedApps: pressed })}
                                        ariaLabel="Toggle pinned apps"
                                    />
                                </div>
                                <div className="setting-row">
                                    <div className="setting-copy">
                                        <div className="setting-label">Task Planner</div>
                                        <p className="setting-hint">Show the Today planner alongside bookmarks.</p>
                                    </div>
                                    <ToggleSwitch
                                        pressed={settings.showTaskPlanner}
                                        onPressedChange={(pressed) => updateSettings({ showTaskPlanner: pressed })}
                                        ariaLabel="Toggle task planner"
                                    />
                                </div>
                                <div className="setting-row">
                                    <div className="setting-copy">
                                        <div className="setting-label">Recent Activity</div>
                                        <p className="setting-hint">Show a lightweight section for recently visited pages.</p>
                                    </div>
                                    <ToggleSwitch
                                        pressed={settings.showRecentActivity}
                                        onPressedChange={(pressed) => updateSettings({ showRecentActivity: pressed })}
                                        ariaLabel="Toggle recent activity"
                                    />
                                </div>
                                <div className="setting-row">
                                    <div className="setting-copy">
                                        <div className="setting-label">Snippet Shelf</div>
                                        <p className="setting-hint">Save frequently used commands and code blocks for quick copy.</p>
                                    </div>
                                    <ToggleSwitch
                                        pressed={settings.showSnippetShelf}
                                        onPressedChange={(pressed) => updateSettings({ showSnippetShelf: pressed })}
                                        ariaLabel="Toggle snippet shelf"
                                    />
                                </div>
                                <div className="setting-row">
                                    <div className="setting-copy">
                                        <div className="setting-label">Dev Shortcuts</div>
                                        <p className="setting-hint">Quick access to local dev URLs and environments.</p>
                                    </div>
                                    <ToggleSwitch
                                        pressed={settings.showDevShortcuts}
                                        onPressedChange={(pressed) => updateSettings({ showDevShortcuts: pressed })}
                                        ariaLabel="Toggle dev shortcuts"
                                    />
                                </div>
                            </section>
                            <section className="card-subtle space-y-4 p-4">
                                <div className="space-y-1">
                                    <h3 className="section-heading">Workspace Layout</h3>
                                    <p className="section-copy">Choose which surfaces are visible and which utility panels open by default.</p>
                                </div>
                                {[
                                    { key: 'showWeatherWidget', label: 'Weather Widget' },
                                    { key: 'showBookmarks', label: 'Bookmarks' },
                                    { key: 'showDevPanel', label: 'Dev Panel' },
                                    { key: 'showTerminalNotes', label: 'Terminal Notes' }
                                ].map(({ key, label }) => (
                                    <div key={key} className="setting-row">
                                        <div className="setting-copy">
                                            <div className="setting-label">{label}</div>
                                        </div>
                                        <ToggleSwitch
                                            pressed={settings[key as keyof typeof settings] as boolean}
                                            onPressedChange={(pressed) => updateSettings({ [key]: pressed })}
                                            ariaLabel={`Toggle ${label}`}
                                        />
                                    </div>
                                ))}
                                <div className="setting-row border-t border-[var(--border)] pt-4">
                                    <div className="setting-copy">
                                        <div className="setting-label">Dev Panel Open</div>
                                        <p className="setting-hint">Keep the utilities panel expanded on launch.</p>
                                    </div>
                                    <ToggleSwitch
                                        pressed={settings.devPanelOpen}
                                        onPressedChange={(pressed) => updateSettings({ devPanelOpen: pressed })}
                                        ariaLabel="Toggle dev panel"
                                    />
                                </div>
                                <div className="setting-row">
                                    <div className="setting-copy">
                                        <div className="setting-label">Terminal Notes Open</div>
                                        <p className="setting-hint">Show the notes panel immediately when a new tab opens.</p>
                                    </div>
                                    <ToggleSwitch
                                        pressed={settings.terminalNotesOpen}
                                        onPressedChange={(pressed) => updateSettings({ terminalNotesOpen: pressed })}
                                        ariaLabel="Toggle terminal notes"
                                    />
                                </div>
                            </section>
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
