// Body, Params, Query

import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import { contactPageSchema } from "../types/validation.types.js";
import { Contact } from "../models/contact.model.js";
import { MESSAGES_LIMIT } from "../constants.js";

export const addContact  = asyncHandler(async(req: Request, res: Response) => {

    console.log(req.body); // Debug log

    let parsed = contactPageSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(issue => issue.message).join(", ");
        throw new ApiError(400, messages);
    }

    console.log(parsed.data); // Debug log

    const contact = await Contact.create({ ...parsed.data, read: false });

    return ApiResponse(res, 201, "Message sent successfully", contact);

});

export const editContact  = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "ID is required");
    }

    const contact = await Contact.findByIdAndUpdate(
        id,
        { read: true },
        { new: true }
    );
    if (!contact) {
        throw new ApiError(404, "Message not found");
    }

    return ApiResponse(res, 200, "Message marked as read", contact);
});

const fetchContacts = async (filter: Record<string, any>, cursor?: string) => {
    const query: any = { ...filter };

    if (cursor) {
        const date = new Date(cursor);
        if (isNaN(date.getTime())) {
            throw new ApiError(400, "Invalid cursor");
        }
        query.createdAt = { $lt: date };
    }

    const items = await Contact.find(query).sort({ createdAt: -1 }).limit(MESSAGES_LIMIT + 1);

    const hasMore = items.length > MESSAGES_LIMIT;
    if (hasMore) items.pop();

    return {
        items,
        hasMore,
        nextCursor: items.length ? items[items.length - 1].createdAt : null
    }
};

export const getAllContacts = asyncHandler(async (req: Request, res: Response) => {
    const data = await fetchContacts({}, req.query.cursor as string);
    return ApiResponse(res, 200, "Messages retrieved successfully", data);
});

export const getReadContacts = asyncHandler(async (req: Request, res: Response) => {
    const data = await fetchContacts({ read: true }, req.query.cursor as string);
    return ApiResponse(res, 200, "Read messages retrieved successfully", data);
});

export const getUnreadContacts = asyncHandler(async (req: Request, res: Response) => {
    const data = await fetchContacts({ read: false }, req.query.cursor as string);
    return ApiResponse(res, 200, "Unread messages retrieved successfully", data);
});

export const deleteContact  = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "ID is required");
    }

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
        throw new ApiError(404, "Message not found");
    }
    return ApiResponse(res, 200, "Message deleted successfully", contact);
});