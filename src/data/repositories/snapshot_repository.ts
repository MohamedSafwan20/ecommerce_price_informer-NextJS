import { prisma } from "../../app/api/_base";
import { Snapshot } from "../models/snapshot_model";

export default class SnapshotRepository {
  static async addSnapshot({ snapshot }: { snapshot: Snapshot }) {
    try {
      await prisma.snapshot.create({
        data: snapshot,
      });

      return { status: true };
    } catch (e: any) {
      return { status: false, msg: e.message };
    }
  }
}
