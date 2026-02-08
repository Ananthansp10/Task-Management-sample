# Analytics API

All analytics endpoints require authentication and are under `/api/analytics`.

## Get Dashboard Statistics

**GET** `/api/analytics/dashboard`

Retrieve comprehensive dashboard statistics.

### Response: `200 OK`

```json
{
  "success": true,
  "message": "Dashboard stats fetched successfully",
  "data": {
    "tasks": {
      "total": 150,
      "pending": 45,
      "inProgress": 60,
      "completed": 45
    },
    "priority": {
      "low": 30,
      "medium": 70,
      "high": 50
    },
    "overdue": 12
  }
}
```

### Statistics Breakdown

| Field | Description |
|-------|-------------|
| `tasks.total` | Total number of tasks |
| `tasks.pending` | Tasks with status "pending" |
| `tasks.inProgress` | Tasks with status "in-progress" |
| `tasks.completed` | Tasks with status "completed" |
| `priority.low` | Tasks with low priority |
| `priority.medium` | Tasks with medium priority |
| `priority.high` | Tasks with high priority |
| `overdue` | Tasks past due date and not completed |

---

## Usage Examples

### Get dashboard stats

```bash
curl -X GET http://localhost:3000/api/analytics/dashboard \
  -b cookies.txt
```

### JavaScript Example

```javascript
fetch('http://localhost:3000/api/analytics/dashboard', {
  method: 'GET',
  credentials: 'include'
})
.then(response => response.json())
.then(data => {
  console.log('Total tasks:', data.data.tasks.total);
  console.log('Overdue tasks:', data.data.overdue);
});
```

---

## Use Cases

- Display dashboard overview
- Show task distribution charts
- Monitor overdue tasks
- Track completion rates
- Visualize priority distribution
