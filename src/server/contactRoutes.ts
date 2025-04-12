"use strict";

import express, { Request, Response } from "express"
import Database from "./database.js";

const router = express.Router();

interface Contact {
    id: string;
    fullName: string;
    contactNumber: string;
    emailAddress: string;
}

router.get('/', async (req: Request, res: Response) => {
    try {
        const db = await Database.getInstance().connect();
        const contacts = await db.collection("contacts").find().toArray();
        res.json(contacts);
    } catch (e) {
        console.error(`[ERROR] Failed to fetch contacts: ${e}`)
        res.status(500).json({message: "Failed to connect to Server"})
    }
})

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const db = await Database.getInstance().connect();
        const contact = await db.collection("contacts").findOne({ id: req.params.id });
        if (contact) res.json(contact);
        else res.status(404).json({message: "Contact Not Found"})
    } catch (e) {
        console.error(`[ERROR] Failed to fetch contact: ${e}`)
        res.status(500).json({message: "Failed to connect to Server"})
    }
})

router.post('/', async (req: Request, res: Response) => {
    try {
        const db = await Database.getInstance().connect();
        const contacts = await db.collection("contacts").find().toArray();
        const newID = contacts.length > 0
            ? (Math.max(...contacts.map(c => parseInt(c.id))) + 1).toString()
            : "1";
        const newContact: Contact = {id: newID, ...req.body};
        await db.collection("contacts").insertOne(newContact);
        // use code 201 when adding a new record to the db
        res.status(201).json(newContact);
    } catch (e) {
        console.error(`[ERROR] Failed to insert contact: ${e}`)
        res.status(500).json({message: "Failed to connect to Server"})
    }
})

router.put("/:id", async (req: Request, res: Response) => {

    try {
        const db = await Database.getInstance().connect();
        const { ...updatedData } = req.body;
        const result = await db.collection("contacts")
            .findOneAndUpdate(
                { id: req.params.id },
                { $set: updatedData },
                { returnDocument: 'after' }
            );

        if (result && result.value) res.json(result.value);
        else  {
            const updatedContact =
                await db.collection("contacts").findOne({ id: req.params.id });
            if (updatedContact) res.json(updatedContact);
            else res.status(404).json({message: `Contact Not Found`})
        }
    } catch (e) {
        console.error(`[ERROR] Failed to update contact: ${e}`)
        res.status(500).json({message: "Failed to connect to Server"})
    }
})

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const db = await Database.getInstance().connect();
        const result = await db.collection("contacts").deleteOne({ id: req.params.id });
        if (result.deletedCount > 0) res.json({message: "Contact Deleted"});
        else res.status(404).json({message: "Contact Not Found"})
    } catch (e) {
        console.error(`[ERROR] Failed to delete contact: ${e}`)
        res.status(500).json({message: "Failed to connect to Server"})
    }
})

export default router;