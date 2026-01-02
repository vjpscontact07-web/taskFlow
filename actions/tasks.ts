"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { taskSchema, type TaskInput } from "@/lib/validations/task";
import { revalidatePath } from "next/cache";

/**
 * Get all tasks for the current user
 * Admins can see all tasks
 */
export async function getTasks() {
  try {
    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Admin can see all tasks, users see only their own
    const tasks = await prisma.task.findMany({
      where: session.user.role === "ADMIN" ? {} : { userId: session.user.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: tasks,
    };
  } catch (error) {
    console.error("Get tasks error:", error);
    return {
      success: false,
      error: "Failed to fetch tasks",
    };
  }
}

/**
 * Create a new task
 */
export async function createTask(data: TaskInput) {
  try {
    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Validate input
    const validatedFields = taskSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Invalid input data",
      };
    }

    const task = await prisma.task.create({
      data: {
        ...validatedFields.data,
        userId: session.user.id,
      },
    });

    // Revalidate the tasks page to show new data
    revalidatePath("/tasks");

    return {
      success: true,
      data: task,
      message: "Task created successfully",
    };
  } catch (error) {
    console.error("Create task error:", error);
    return {
      success: false,
      error: "Failed to create task",
    };
  }
}

/**
 * Update an existing task
 */
export async function updateTask(id: string, data: Partial<TaskInput>) {
  try {
    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Check if task exists and user has permission
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return {
        success: false,
        error: "Task not found",
      };
    }

    // Only task owner or admin can update
    if (
      existingTask.userId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return {
        success: false,
        error: "Forbidden",
      };
    }

    // Validate input
    const validatedFields = taskSchema.partial().safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Invalid input data",
      };
    }

    const task = await prisma.task.update({
      where: { id },
      data: validatedFields.data,
    });

    revalidatePath("/tasks");

    return {
      success: true,
      data: task,
      message: "Task updated successfully",
    };
  } catch (error) {
    console.error("Update task error:", error);
    return {
      success: false,
      error: "Failed to update task",
    };
  }
}

/**
 * Delete a task
 */
export async function deleteTask(id: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Check if task exists and user has permission
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return {
        success: false,
        error: "Task not found",
      };
    }

    // Only task owner or admin can delete
    if (
      existingTask.userId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return {
        success: false,
        error: "Forbidden",
      };
    }

    await prisma.task.delete({
      where: { id },
    });

    revalidatePath("/tasks");

    return {
      success: true,
      message: "Task deleted successfully",
    };
  } catch (error) {
    console.error("Delete task error:", error);
    return {
      success: false,
      error: "Failed to delete task",
    };
  }
}
