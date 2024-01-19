import {
    Badge,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from '@/components/ui';
import type { User } from '@/types/User';

type TeamDetailsTableProps = {
    teamMembers: User[];
};

export const TeamDetailsTable = ({ teamMembers }: TeamDetailsTableProps) => {
    return (
        <Card>
            <Table>
                <TableHead className='text-left'>
                    <TableHeaderCell>Username</TableHeaderCell>
                    <TableHeaderCell>Email</TableHeaderCell>
                    <TableHeaderCell>Role</TableHeaderCell>
                </TableHead>
                <TableBody>
                    {teamMembers.map((teamMember) => (
                        <TableRow key={teamMember.userId}>
                            <TableCell>{teamMember.userName}</TableCell>
                            <TableCell>{teamMember.primaryEmail}</TableCell>
                            <TableCell>
                                <Badge variant={teamMember.isAdmin ? 'Active' : 'Pending'}>
                                    {teamMember.isAdmin ? 'Admin' : 'Member'}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};
