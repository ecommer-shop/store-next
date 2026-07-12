import {Button} from '@heroui/react';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Tag} from 'lucide-react';
import {applyPromotionCode, removePromotionCode} from './actions';
import { I18N } from '@/i18n/keys';
import { getTranslations } from 'next-intl/server';

type ActiveOrder = {
    id: string;
    couponCodes?: string[] | null;
};

export async function PromotionCode({activeOrder}: { activeOrder: ActiveOrder }) {
    const t = await getTranslations('Cart');
    return (
        <Card className="mt-4 lg:sticky lg:top-7">
            <CardHeader className="px-3 py-3 lg:px-6 lg:py-4">
                <CardTitle className="text-sm lg:text-lg flex items-center gap-2">
                    <Tag className="h-4 w-4 lg:h-5 lg:w-5"/>
                    {t(I18N.Cart.promotionCode.title)}
                </CardTitle>
                <CardDescription className="text-xs lg:text-sm mt-1">
                    {t(I18N.Cart.promotionCode.description)}
                </CardDescription>
            </CardHeader>
            <CardContent className="px-3 pb-3 lg:px-6 lg:pb-6">
                {activeOrder.couponCodes && activeOrder.couponCodes.length > 0 ? (
                    <div className="space-y-2">
                        {activeOrder.couponCodes.map((code) => (
                            <div key={code}
                                 className="flex items-center justify-between p-2 lg:p-3 border rounded-md bg-green-50 dark:bg-green-950/20">
                                <div className="flex items-center gap-2">
                                    <Tag className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-green-600"/>
                                    <span className="font-medium text-xs lg:text-sm">{code}</span>
                                </div>
                                <form action={removePromotionCode}>
                                    <input type="hidden" name="code" value={code}/>
                                    <Button
                                        type="submit"
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 lg:h-8 text-xs lg:text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        {t(I18N.Cart.promotionCode.remove)}
                                    </Button>
                                </form>
                            </div>
                        ))}
                    </div>
                ) : (
                    <form action={applyPromotionCode} className="flex gap-2">
                        <Input
                            type="text"
                            name="code"
                            placeholder={t(I18N.Cart.promotionCode.placeholder)}
                            className="flex-1 h-9 lg:h-10 text-sm"
                            required
                        />
                        <Button 
                            type="submit" 
                            className="h-9 lg:h-10 px-3 lg:px-4 text-xs lg:text-sm"
                        >
                            {t(I18N.Cart.promotionCode.apply)}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
