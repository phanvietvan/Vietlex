const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Giả lập Database (Sẽ thay bằng MongoDB sau)
let userStats = {
    xp: 0,
    level: 1,
    srs: [],
    vocabList: [] // Danh sách từ vựng cá nhân
};

// API: Lấy danh sách từ vựng
app.get('/api/user/vocab', (req, res) => {
    res.json(userStats.vocabList);
});

// API: Lưu từ vựng mới
app.post('/api/user/vocab', (req, res) => {
    const { word, definition, pronunciation } = req.body;
    const exists = userStats.vocabList.find(v => v.word === word);
    
    if (!exists) {
        userStats.vocabList.push({ 
            word, 
            definition, 
            pronunciation, 
            addedAt: Date.now(),
            mastery: 0 
        });
    }
    res.json({ success: true, list: userStats.vocabList });
});

// API: Tạo bài học bằng AI (Expert IELTS Logic)
app.post('/api/generate-lesson', async (req, res) => {
    const { topic, band = "7.5" } = req.body;
    
    // Lấy dữ liệu thực tế từ "Database" của người dùng
    const weak_words = userStats.srs.map(s => s.word).slice(0, 5).join(', ');
    const library_words = userStats.vocabList.map(v => v.word).slice(0, 5).join(', ');

    console.log(`Expert AI generating IELTS passage for: ${topic}`);

    /**
     * Ghi chú: Ở đây chúng ta sẽ gọi Gemini/OpenAI API với System Prompt bạn vừa cung cấp.
     * Vì hiện tại đang chạy môi trường simulation, tôi sẽ giả lập kết quả đầu ra 
     * chuẩn theo phong cách IELTS Expert mà bạn yêu cầu.
     */
    
    const generateIELTSPassage = (topic, band, weak, library) => {
        const topicLower = topic.toLowerCase();
        
        // Từ điển chủ đề mở rộng
        const passages = {
            "environment": `The implementation of stringent environmental regulations is crucial for the mitigation of climate change. Many argue that governmental authorities should prioritize sustainable development to ensure the preservation of natural resources for future generations. Furthermore, the transition to renewable energy sources is not merely an option but a necessity to curtail carbon emissions. If individuals cultivate eco-friendly habits, the cumulative impact could significantly alleviate current ecological pressures. Ultimately, a multi-faceted approach involving both legislative action and public cooperation is indispensable for fostering a resilient ecosystem.`,
            "education": `The integration of advanced technology in modern classrooms has fundamentally transformed the educational landscape. Proponents of digital learning suggest that interactive tools facilitate a more comprehensive understanding of complex concepts. However, it is imperative that educators maintain a balance between technological utilization and traditional pedagogical methods to foster critical thinking. Moreover, equitable access to digital resources must be ensured to prevent the widening of the academic gap. Consequently, a holistic strategy is required to maximize the benefits of educational innovations while preserving the integrity of formal instruction.`,
            "technology": `The rapid advancement of artificial intelligence has elicited a broad spectrum of opinions regarding its potential impact on the workforce. While some experts emphasize the enhancement of productivity and efficiency, others express concerns about the potential displacement of human labor. It is essential for policymakers to establish a robust framework that promotes ethical AI development while protecting workers' rights. Furthermore, fostering a culture of continuous learning and adaptation is vital for navigating the evolving digital economy. In conclusion, the strategic alignment of technological growth and social responsibility is paramount for sustainable progress.`,
            "toán": `Mathematics serves as the foundational language of modern science and technology, playing a pivotal role in analytical problem-solving. In the contemporary era, the mastery of mathematical concepts is indispensable for navigating the complexities of data-driven industries. Many scholars contend that a robust mathematical education fosters logical reasoning and critical thinking abilities among students. Furthermore, the application of complex algorithms is essential for the advancement of fields such as cryptography and engineering. Consequently, prioritizing numerical literacy is paramount for achieving success in the competitive global job market.`,
            "math": `Mathematics serves as the foundational language of modern science and technology, playing a pivotal role in analytical problem-solving. In the contemporary era, the mastery of mathematical concepts is indispensable for navigating the complexities of data-driven industries. Many scholars contend that a robust mathematical education fosters logical reasoning and critical thinking abilities among students. Furthermore, the application of complex algorithms is essential for the advancement of fields such as cryptography and engineering. Consequently, prioritizing numerical literacy is paramount for achieving success in the competitive global job market.`
        };

        return passages[topicLower] || `The discourse surrounding ${topic} has gained significant momentum in contemporary society. Many scholars contend that a thorough examination of this subject is essential to address the multifaceted challenges it presents. By implementing strategic interventions and fostering international collaboration, stakeholders can navigate the complexities associated with ${topic} more effectively. Moreover, the promotion of public awareness and informed decision-making is vital for achieving long-term success. In essence, a comprehensive understanding of ${topic} is indispensable for fostering a more informed and resilient global community.`;
    };

    const content = generateIELTSPassage(topic, band, weak_words, library_words);
    
    res.json({ content });
});

// API: Cập nhật XP và SRS
app.post('/api/user/stats', (req, res) => {
    const { xpGained, mistakes } = req.body;
    userStats.xp += xpGained;
    
    // Logic tính level đơn giản
    userStats.level = Math.floor(userStats.xp / 1000) + 1;
    
    // Cập nhật SRS
    if (mistakes && mistakes.length > 0) {
        mistakes.forEach(word => {
            const existing = userStats.srs.find(s => s.word === word);
            if (existing) existing.count++;
            else userStats.srs.push({ word, count: 1 });
        });
    }

    res.json(userStats);
});

app.listen(PORT, () => {
    console.log(`Vietlex Backend is running on port ${PORT}`);
});
