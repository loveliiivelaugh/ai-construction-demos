import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useConstructionStore, type Material } from '../../../../utilities/store/constructionStore';

const statusColors: Record<Material['status'], 'warning' | 'info' | 'success'> = {
  needed: 'warning',
  ordered: 'info',
  delivered: 'success',
};

export function MaterialsPage() {
  const { materials, updateMaterialStatus } = useConstructionStore();
  const [orderingId, setOrderingId] = useState<string | null>(null);

  const totalCost = materials.reduce((sum, m) => sum + m.quantity * m.unitCost, 0);
  const orderedCount = materials.filter((m) => m.status === 'ordered').length;
  const deliveredCount = materials.filter((m) => m.status === 'delivered').length;

  async function handleOrder(id: string) {
    setOrderingId(id);
    await new Promise((res) => setTimeout(res, 800));
    updateMaterialStatus(id, 'ordered');
    setOrderingId(null);
  }

  const summaryCards = [
    { label: 'Total Materials', value: materials.length, icon: '📦', color: 'primary' },
    { label: 'Ordered', value: orderedCount, icon: '🔄', color: 'info' },
    { label: 'Delivered', value: deliveredCount, icon: '✅', color: 'success' },
    { label: 'Total Cost', value: `$${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: '💵', color: 'warning' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Materials Planning
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track materials status, vendors, and costs
          </Typography>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {summaryCards.map((card) => (
          <Grid item xs={6} sm={3} key={card.label}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography fontSize={24}>{card.icon}</Typography>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {card.label}
                    </Typography>
                    <Typography variant="h6" fontWeight={800} color={`${card.color}.main`}>
                      {card.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Materials Table */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Material</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Vendor</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Unit Cost</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Total Cost</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.map((mat) => (
              <TableRow key={mat.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {mat.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  {mat.quantity} {mat.unit}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {mat.vendor}
                  </Typography>
                </TableCell>
                <TableCell>${mat.unitCost.toFixed(2)}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  ${(mat.quantity * mat.unitCost).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </TableCell>
                <TableCell>
                  <Chip
                    label={mat.status}
                    size="small"
                    color={statusColors[mat.status]}
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell>
                  {mat.status === 'needed' && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      disabled={orderingId === mat.id}
                      onClick={() => handleOrder(mat.id)}
                      startIcon={
                        orderingId === mat.id ? (
                          <CircularProgress size={12} color="inherit" />
                        ) : null
                      }
                    >
                      {orderingId === mat.id ? 'Ordering…' : 'Order'}
                    </Button>
                  )}
                  {mat.status === 'ordered' && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      onClick={() => updateMaterialStatus(mat.id, 'delivered')}
                    >
                      Mark Delivered
                    </Button>
                  )}
                  {mat.status === 'delivered' && (
                    <Typography variant="caption" color="success.main" fontWeight={600}>
                      ✓ Delivered
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {materials.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No materials added yet.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default MaterialsPage;
