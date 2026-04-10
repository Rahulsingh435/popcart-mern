import { User } from '@popcart/database';
import bcrypt from 'bcryptjs';

// 🟢 SIGNUP LOGIC
export const signup = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // 1. Check karo ki kya is email YA phone se pehle hi account hai?
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ success: false, message: "Ye email pehle se register hai!" });
            }
            if (existingUser.phone === phone) {
                return res.status(400).json({ success: false, message: "Ye phone number pehle se register hai!" });
            }
        }

        // 2. Password ko "Secret Code" (Hash) mein badlo
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Naya User Database mein save karo
        const newUser = await User.create({
            name,
            email,
            phone, 
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "Account mast ban gaya! 🎉",
            user: { 
                id: newUser._id, 
                name: newUser.name, 
                email: newUser.email, 
                phone: newUser.phone, 
                role: newUser.role 
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 🔵 LOGIN LOGIC
export const login = async (req, res) => {
    try {
        // 🔄 YAHAN THI GALTI: 'email' ki jagah 'identifier' hona chahiye
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ success: false, message: "Details poori bharein!" });
        }

        // Extra spaces hatao aur lowercase karo
        const cleanIdentifier = identifier.trim().toLowerCase();

        // 1. Dhoondo ki is naam se koi Email YA Phone database mein hai kya?
        const user = await User.findOne({ 
            $or: [
                { email: cleanIdentifier },
                { phone: cleanIdentifier } 
            ] 
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "Account nahi mila! Pehle Signup karein." });
        }

        // 2. Password match karo
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Galat Password! ❌" });
        }

        // 3. Agar sab theek hai, toh user ko bhej do
        res.status(200).json({
            success: true,
            message: "Login Successful! 😎",
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};