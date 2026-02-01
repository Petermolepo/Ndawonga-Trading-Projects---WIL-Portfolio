# Ndawonga Trading & Projects - WIL Portfolio

A comprehensive web application for **Ndawonga Trading & Projects**, a 100% Black-Owned Civil Engineering & Waste Management company. This project showcases modern web development practices while serving as a complete business solution for project management, tender applications, and client engagement.

## 🏢 About Ndawonga Trading & Projects

- **100% Black Owned** civil engineering company
- **Level 1 B-BBEE** certified
- **50% Women-Owned** promoting gender equality
- **CIDB Registered** for government tenders
- Specializing in roads, earthworks, water & sanitation, and waste management

## 🚀 Features

### Frontend
- **Responsive Design** - Mobile-first approach with modern CSS Grid/Flexbox
- **Interactive Project Gallery** - Showcase completed projects with filtering
- **Tender Management** - Real-time tender listings with document downloads
- **Team Profiles** - Meet the leadership team
- **Contact Forms** - Multiple contact methods with form validation
- **Quote Calculator** - Automated project cost estimation
- **AI Chatbot** - Intelligent assistant for common inquiries
- **Dark/Light Theme** - User preference toggle
- **Document Portal** - Access to certificates and company documents

### Backend
- **RESTful API** - Clean API endpoints for all functionality
- **MySQL Database** - Robust data storage with connection pooling
- **File Upload System** - Secure document and image handling
- **Admin Panel** - Content management for projects and tenders
- **Contact Management** - Message handling and quote requests
- **Chatbot Integration** - Contextual responses with conversation logging

## 🛠 Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **Vanilla JavaScript** - No framework dependencies
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

## 📁 Project Structure

```
ndawonga-trading-projects/
├── backend/
│   ├── server.js          # Main server file
│   ├── db.js             # Database connection
│   ├── .env              # Environment variables
│   └── uploads/          # File upload directory
├── frontend/
│   ├── index.html        # Homepage
│   ├── projects.html     # Projects showcase
│   ├── tenders.html      # Tender listings
│   ├── team.html         # Team profiles
│   ├── services.html     # Service offerings
│   ├── about.html        # Company information
│   ├── contact.html      # Contact forms
│   ├── admin.html        # Admin panel
│   └── assets/
│       ├── css/
│       │   ├── style.css     # Main styles
│       │   └── chatbot.css   # Chatbot styles
│       └── js/
│           ├── main.js       # Core functionality
│           └── chatbot.js    # Chatbot logic
├── package.json          # Dependencies
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **MySQL** (v8.0 or higher)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Petermolepo/Ndawonga-Trading-Projects---WIL-Portfolio.git
   cd Ndawonga-Trading-Projects---WIL-Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   - Create a MySQL database named `ndawonga_db`
   - Update the `.env` file with your database credentials:
   ```env
   DB_HOST=127.0.0.1
   DB_USER=your_username
   DB_PASS=your_password
   DB_NAME=ndawonga_db
   PORT=5000
   ```

4. **Create database tables**
   ```sql
   -- Projects table
   CREATE TABLE projects (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     description TEXT,
     type VARCHAR(100),
     year INT,
     location VARCHAR(255),
     featured_image VARCHAR(255),
     status VARCHAR(50) DEFAULT 'active',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Tenders table
   CREATE TABLE tenders (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     description TEXT,
     closing_date DATE,
     file VARCHAR(255),
     featured BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Team table
   CREATE TABLE team (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     position VARCHAR(255),
     bio TEXT,
     image VARCHAR(255),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Messages table
   CREATE TABLE messages (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255),
     email VARCHAR(255),
     phone VARCHAR(50),
     subject VARCHAR(255),
     message TEXT,
     category VARCHAR(100) DEFAULT 'General',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Quotes table
   CREATE TABLE quotes (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255),
     email VARCHAR(255),
     phone VARCHAR(50),
     project_type VARCHAR(100),
     area_sq_m DECIMAL(10,2) DEFAULT 0,
     complexity VARCHAR(50) DEFAULT 'medium',
     estimated_cost DECIMAL(15,2) DEFAULT 0,
     message TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Documents table
   CREATE TABLE documents (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     filename VARCHAR(255),
     visible BOOLEAN DEFAULT TRUE,
     uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Chatbot logs table
   CREATE TABLE chatbot_logs (
     id INT AUTO_INCREMENT PRIMARY KEY,
     session_id VARCHAR(255),
     user_message TEXT,
     bot_response TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

6. **Access the application**
   - Open your browser to `http://localhost:5000`

## 📊 API Endpoints

### Projects
- `GET /api/projects` - Get all active projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project (with file upload)

### Tenders
- `GET /api/tenders` - Get all tenders
- `POST /api/tenders` - Create new tender (with file upload)

### Team
- `GET /api/team` - Get team members

### Documents
- `GET /api/documents` - Get visible documents

### Contact & Quotes
- `POST /api/contact` - Submit contact message
- `POST /api/quotes` - Submit quote request

### Chatbot
- `POST /api/chat` - Chat with AI assistant

## 🎯 Key Features Explained

### Quote Calculator
The automated quote system estimates project costs based on:
- Project type (roads, earthworks, water/sanitation, waste management)
- Area in square meters
- Complexity level (simple, medium, complex)
- Base rates per project type

### Chatbot Integration
- Context-aware responses about tenders, projects, and certificates
- Conversation logging for analytics
- Fallback responses for unrecognized queries

### Admin Panel
- Project management with image uploads
- Tender posting with document attachments
- Message and quote request viewing

## 🔒 Security Features

- Input validation and sanitization
- File upload restrictions
- SQL injection prevention with prepared statements
- CORS configuration
- Environment variable protection

## 🚀 Deployment

### Environment Variables
Create a `.env` file in the backend directory:
```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=ndawonga_db
PORT=5000
```

### Production Considerations
- Use a process manager like PM2
- Set up SSL certificates
- Configure reverse proxy (Nginx)
- Enable database backups
- Monitor application logs

## 🤝 Contributing

This is a WIL (Work Integrated Learning) portfolio project. Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Peter Molepo**
- GitHub: [@Petermolepo](https://github.com/Petermolepo)
- Project: WIL Portfolio - Civil Engineering Web Application

## 🙏 Acknowledgments

- **Ndawonga Trading & Projects** for the business case study
- **WIL Program** for the learning opportunity
- **Open Source Community** for the tools and libraries used

## 📞 Support

For support, email peter.molepo@example.com or create an issue in this repository.

---

**Built with ❤️ for the WIL Portfolio Project**