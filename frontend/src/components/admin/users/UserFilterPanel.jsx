import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserFilterPanel = ({ email, setEmail, category, setCategory }) => {
  return (
    <div className="w-full flex flex-col gap-8 bg-white dark:bg-zinc-900 shadow-sm rounded-2xl px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-center">
        <div>
          <h1 className="text-zinc-900 dark:text-zinc-100 text-3xl font-extrabold">
            Users Management
          </h1>
          <p className="text-customGray text-sm mt-1 font-bold">
            Manage your library users and their access
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/2">
          <Input
            placeholder="Search user by email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-1/2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select User Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active Users</SelectItem>
              <SelectItem value="blocked">Blocked Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default UserFilterPanel;
