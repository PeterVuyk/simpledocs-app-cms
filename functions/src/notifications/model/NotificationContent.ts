// For aggregate the component type (calculations / decisionTree etc). for books aggregate is always 'bookType'. We only
// support navigation for books. But because we always send the aggregate we can later easy add more navigation
// functionality.
interface NotificationNavigation {
 aggregate: string;
 id: string;
}

interface NotificationData {
 navigate?: NotificationNavigation;
}

export interface NotificationContent {
 body?: string;
 title?: string;
 data?: NotificationData
}
