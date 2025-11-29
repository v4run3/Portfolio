# Add Projects to Portfolio

This guide shows you multiple ways to add projects to your portfolio database.

## Option 1: Using the Seed Script (Easiest)

I've created a seed script that adds sample projects to your database:

```bash
cd server
node seedProjects.js
```

This will add 3 sample projects. You can edit `seedProjects.js` to customize the projects before running it.

## Option 2: Using curl (Command Line)

Make sure your server is running first:
```bash
cd server
npm start
```

Then in another terminal, run:

```bash
curl -X POST http://localhost:5000/api/projects ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"My Project\",\"description\":\"A cool project\",\"image\":\"https://example.com/image.jpg\",\"link\":\"https://github.com/user/project\",\"tags\":[\"React\",\"Node\"]}"
```

## Option 3: Using Postman or Thunder Client

1. **Method**: POST
2. **URL**: `http://localhost:5000/api/projects`
3. **Headers**: 
   - `Content-Type: application/json`
4. **Body** (raw JSON):
```json
{
  "title": "My Project",
  "description": "A cool project",
  "image": "https://example.com/image.jpg",
  "link": "https://github.com/user/project",
  "tags": ["React", "Node"]
}
```

## Option 4: Using MongoDB Compass

1. Open MongoDB Compass
2. Connect using your MongoDB URI
3. Navigate to your database
4. Find the `projects` collection
5. Click "ADD DATA" → "Insert Document"
6. Paste:
```json
{
  "title": "My Project",
  "description": "A cool project",
  "image": "https://example.com/image.jpg",
  "link": "https://github.com/user/project",
  "tags": ["React", "Node"],
  "createdAt": "2025-11-29T08:27:09.000Z"
}
```

## Option 5: Using JavaScript fetch (Browser Console)

Open your browser console and run:

```javascript
fetch('http://localhost:5000/api/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: "My Project",
    description: "A cool project",
    image: "https://example.com/image.jpg",
    link: "https://github.com/user/project",
    tags: ["React", "Node"]
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

## Sample Project Ideas

Here are some image URLs you can use for your projects:

- **Portfolio/Web**: `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800`
- **E-Commerce**: `https://images.unsplash.com/photo-1557821552-17105176677c?w=800`
- **Task Manager**: `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800`
- **Social Media**: `https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800`
- **Mobile App**: `https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800`
