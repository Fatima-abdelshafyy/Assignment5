import { UniqueConstraintError, ValidationError, ForeignKeyConstraintError } from "sequelize";

export function handleError(res, error) {
  if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.errors?.map((item) => item.message) ?? [error.message]
    });
  }

  if (error instanceof ForeignKeyConstraintError) {
    return res.status(400).json({
      message: "Invalid userId or postId. Make sure the related record exists."
    });
  }

  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
}
