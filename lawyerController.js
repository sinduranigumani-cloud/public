import Lawyer from "../models/Lawyer.js";

export async function getLawyers(req, res) {
  try {
    const { search = "", city = "" } = req.query;
    const filter = { available: true };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } }
      ];
    }
    if (city) filter.city = { $regex: city, $options: "i" };
    const lawyers = await Lawyer.find(filter).sort({ createdAt: -1 });
    res.json(lawyers);
  } catch (error) {
    res.status(500).json({ message: "Could not load lawyers.", error: error.message });
  }
}

export async function createLawyer(req, res) {
  try {
    const { name, specialization, experienceYears, city, consultationFee, description } = req.body;
    if (!name || !specialization) {
      return res.status(400).json({ message: "Lawyer name and specialization are required." });
    }
    const lawyer = await Lawyer.create({
      name, specialization, experienceYears, city, consultationFee, description
    });
    res.status(201).json(lawyer);
  } catch (error) {
    res.status(500).json({ message: "Could not add lawyer.", error: error.message });
  }
}
