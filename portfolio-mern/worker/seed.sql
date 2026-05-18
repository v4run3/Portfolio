-- Ported from server/seedProjects.js
INSERT INTO projects (id, title, description, image, link, tags, created_at) VALUES
  (
    lower(hex(randomblob(16))),
    'Portfolio Website',
    'A modern MERN stack portfolio website with dark theme',
    'https://ik.imagekit.io/ytnwsw1tm/Screenshot%202025-11-29%20155453.png',
    'https://github.com/v4run3/Portfolio',
    '["React","Node.js","MongoDB","Express"]',
    strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  ),
  (
    lower(hex(randomblob(16))),
    'Taskify - Task Management App',
    'A collaborative task management tool with real-time updates',
    'https://ik.imagekit.io/ytnwsw1tm/Pi7_Tool_Screenshot%202025-11-29%20150234(1).jpg',
    'https://github.com/v4run3/Taskify',
    '["React","Node.js","MongoDB","Express"]',
    strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  );
