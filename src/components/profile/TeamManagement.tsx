"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { userApi } from "@/lib/api/users"
import { User, CreateUserPayload, UserRole, UserStatus } from "@/types/user"
import { Search, Edit, Trash2, UserPlus, Mail, Phone, Building } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

export function TeamManagement() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const { data: session } = useSession()
  const currentUser = session?.user
  
  // Check if user is admin
  const isAdmin = (currentUser as any)?.role === 'admin'

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getUsers(),
    enabled: !!currentUser,
  })

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setShowInviteDialog(false)
      toast({
        title: "Användare skapad framgångsrikt",
        description: "Användaren har lagts till i ditt företag.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Fel vid skapande av användare",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: any }) =>
      userApi.updateUser(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setEditingUser(null)
      toast({
        title: "User updated successfully",
        description: "The user's information has been updated.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating user",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        title: "User deleted successfully",
        description: "The user has been removed from your company.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleInviteUser = (formData: FormData) => {
    const payload: CreateUserPayload = {
      email: formData.get('email') as string,
      name: formData.get('name') as string,
      role: formData.get('role') as UserRole,
      phone: formData.get('phone') as string || undefined,
    }

    createUserMutation.mutate(payload)
  }

  const handleUpdateUser = (userId: string, formData: FormData) => {
    const payload = {
      name: formData.get('name') as string,
      role: formData.get('role') as UserRole,
      status: formData.get('status') as UserStatus,
      phone: formData.get('phone') as string || undefined,
    }

    updateUserMutation.mutate({ userId, payload })
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId)
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'manager': return 'bg-blue-100 text-blue-800'
      case 'employee': return 'bg-green-100 text-green-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Teamhantering</h2>
          <p className="text-slate-300">Hantera dina teammedlemmar och deras behörigheter</p>
        </div>
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Bjud in användare
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bjud in ny användare</DialogTitle>
            </DialogHeader>
            <form action={handleInviteUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Namn *</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-post *</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Roll *</Label>
                  <Select name="role" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj roll" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="employee">Anställd</SelectItem>
                      <SelectItem value="viewer">Visare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" name="phone" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowInviteDialog(false)}>
                  Avbryt
                </Button>
                <Button type="submit" disabled={createUserMutation.isPending}>
                  {createUserMutation.isPending ? 'Skapar...' : 'Skapa användare'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Sök användare..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {isAdmin && (
              <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Lägg till användare
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Lägg till ny användare</DialogTitle>
                  </DialogHeader>
                  {/* Invite form will be added here */}
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      {users.length > 0 && users[0].company && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Företagsinformation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Företagsnamn</Label>
                <p className="text-lg font-semibold">{users[0].company.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Plan</Label>
                <p className="text-lg font-semibold capitalize">{users[0].company.plan}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Max användare</Label>
                <p className="text-lg font-semibold">{users[0].company.maxUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Teammedlemmar ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Användare</TableHead>
                <TableHead>Roll</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Senaste inloggning</TableHead>
                <TableHead>Åtgärder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {(user.name || user.email).split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{user.name || user.email}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {userApi.getRoleDisplayName(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {userApi.getStatusDisplayName(user.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString('sv-SE')
                      : 'Aldrig'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingUser(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {user.id !== currentUser?.id && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <form action={(formData) => handleUpdateUser(editingUser.id, formData)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name *</Label>
                  <Input id="edit-name" name="name" defaultValue={editingUser.name || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" value={editingUser.email} disabled />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role *</Label>
                  <Select name="role" defaultValue={editingUser.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="employee">Anställd</SelectItem>
                      <SelectItem value="viewer">Visare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status *</Label>
                  <Select name="status" defaultValue={editingUser.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input id="edit-phone" name="phone" defaultValue={editingUser.phone || ''} />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                  Avbryt
                </Button>
                <Button type="submit" disabled={updateUserMutation.isPending}>
                  {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
