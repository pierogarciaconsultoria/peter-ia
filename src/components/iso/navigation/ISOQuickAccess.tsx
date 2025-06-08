
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { isoSubmenuItems } from './ISOSubmenu';
import { useNavigate } from 'react-router-dom';

export const ISOQuickAccess: React.FC = () => {
  const navigate = useNavigate();

  // Get first 6 items for quick access
  const quickAccessItems = isoSubmenuItems.slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acesso Rápido - ISO 9001:2015</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickAccessItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant="outline"
                className="h-auto flex flex-col gap-2 p-4"
                onClick={() => navigate(item.href)}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm text-center">{item.title}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
