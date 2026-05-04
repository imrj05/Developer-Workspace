export type LegalSection = {
  title: string
  paragraphs?: string[]
  bullets?: string[]
}

export const privacySections: LegalSection[] = [
  {
    title: '1. Data Collection & Usage',
    paragraphs: [
      'Developer Workspace does not collect, store, or share personal user data. The extension only uses permissions necessary for core features, such as:',
    ],
    bullets: [
      'Geolocation: To fetch real-time weather updates.',
      'Notifications: To send Pomodoro timer alerts.',
      'Storage: To save user preferences (themes, settings, etc.).',
    ],
  },
  {
    title: '2. Permissions Explanation',
    paragraphs: [
      'The extension requests only the necessary permissions to function properly:',
    ],
    bullets: [
      'Geolocation: To fetch weather updates based on your location.',
      'Storage: To remember your settings across sessions.',
      'Notifications: To alert you when a timer session ends.',
      "Search: To use Chrome's search API from your preferred search engine within the extension.",
      'Bookmarks: Used to organize and display your bookmarks with custom folders, icons, and filters within the extension UI.',
      'History: Utilized to enhance smart search functionality and suggest relevant developer resources based on browsing trends.',
      'topSites: Accesses your most visited pages to provide quick access shortcuts and categorize frequently used sites into productivity groups.',
    ],
  },
  {
    title: '3. Third-Party Services',
    paragraphs: [
      'Developer Workspace may fetch publicly available data from GitHub and weather APIs. No personal data is stored or shared. Additionally, any third-party integrations, such as news feeds, only display publicly available information.',
      'We use external APIs solely to enhance the functionality of the Developer Workspace extension:',
    ],
    bullets: [
      'GitHub API (https://api.github.com): To fetch public developer activity and repository data, enhancing your dashboard view.',
      'OpenWeatherMap API (https://api.openweathermap.org): To display real-time weather updates based on your location.',
    ],
  },
  {
    title: '4. Data Protection & Security',
    paragraphs: [
      'We ensure that all data handled by the extension remains secure. No data is shared, sold, or used for marketing purposes. Your information stays within your browser and is never transmitted to external servers.',
    ],
  },
  {
    title: '5. User Rights & Choices',
    paragraphs: [
      'Users have full control over their settings and stored preferences. You can:',
    ],
    bullets: [
      'Disable or remove the extension at any time.',
      'Clear stored preferences and reset settings.',
      'Opt out of any optional features through the settings panel.',
    ],
  },
  {
    title: '6. Updates to This Privacy Policy',
    paragraphs: [
      'We may update this policy periodically to reflect changes in our practices. Users will be notified of significant changes through an extension update or announcement.',
    ],
  },
]

export const termsSections: LegalSection[] = [
  {
    title: '1. Acceptance of Terms',
    paragraphs: [
      'By installing or using Developer Workspace, you agree to these Terms & Conditions. If you do not agree with these terms, please discontinue use of the extension.',
    ],
  },
  {
    title: '2. Use of the Extension',
    paragraphs: [
      'Developer Workspace is provided to help improve browsing productivity through features such as smart bookmarks, search tools, GitHub activity widgets, weather updates, and customizable workspace settings.',
      'You agree to use the extension only for lawful purposes and in a way that does not interfere with its normal operation or misuse connected third-party services.',
    ],
  },
  {
    title: '3. Permissions and Local Data',
    paragraphs: [
      'The extension may request browser permissions such as geolocation, notifications, storage, bookmarks, history, search, and topSites only where needed to support its features.',
      'Preferences and settings are stored locally in your browser unless explicitly stated otherwise. You are responsible for reviewing and managing extension permissions through your browser settings.',
    ],
  },
  {
    title: '4. Third-Party Services',
    paragraphs: [
      'Developer Workspace may rely on third-party APIs and public services, including GitHub and OpenWeatherMap, to deliver certain features. Availability, accuracy, and performance of those services are outside our direct control.',
      'Your use of any third-party service accessed through the extension may also be subject to that provider\'s own terms and privacy practices.',
    ],
  },
  {
    title: '5. Intellectual Property',
    paragraphs: [
      'Developer Workspace, including its branding, design, code, and related content, remains the property of its owner unless otherwise stated. You may use the extension for personal or internal productivity use, but you may not copy, resell, or redistribute it in a misleading or unauthorized way.',
    ],
  },
  {
    title: '6. Disclaimer of Warranties',
    paragraphs: [
      'The extension is provided on an "as is" and "as available" basis. We make no guarantees that the extension will always be uninterrupted, error-free, or suitable for every specific workflow or browser environment.',
    ],
  },
  {
    title: '7. Limitation of Liability',
    paragraphs: [
      'To the fullest extent permitted by law, we are not liable for any indirect, incidental, special, or consequential damages arising from your use of, or inability to use, Developer Workspace. This includes loss of data, productivity interruptions, or issues caused by third-party integrations.',
    ],
  },
  {
    title: '8. Changes to These Terms',
    paragraphs: [
      'We may update these Terms & Conditions from time to time to reflect product, legal, or operational changes. Continued use of the extension after updates take effect constitutes acceptance of the revised terms.',
    ],
  },
]
